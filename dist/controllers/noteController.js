"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNoteById = exports.updateNoteById = exports.getNoteById = exports.getAllNotes = exports.createNote = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const note_1 = __importDefault(require("../models/note"));
const helperClaudinary_1 = require("../utils/helperClaudinary");
// Create a new note
const createNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { title, content } = req.body;
        const createdBy = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Assuming `req.user` contains authenticated user information
        if (!createdBy) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        let imageUrls = [];
        let documentUrls = [];
        if ((_b = req.fileUrls) === null || _b === void 0 ? void 0 : _b.length) {
            for (let file of req.fileUrls) {
                if (file.includes("jpg") || file.includes("jpeg")) {
                    imageUrls.push(file);
                }
                else {
                    documentUrls.push(file);
                }
            }
        }
        const note = new note_1.default({
            title,
            content,
            attachments: {
                imageUrls,
                documentUrls,
            },
            createdBy,
        });
        yield note.save();
        res.status(201).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createNote = createNote;
// Get all notes
const getAllNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!user) {
            return res.status(401).json({ message: "User is not valid!" });
        }
        const notes = yield note_1.default.find({ createdBy: user });
        res.status(200).json(notes);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllNotes = getAllNotes;
// Get a note by ID
const getNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_1.default.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getNoteById = getNoteById;
// Update a note by ID
const updateNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const updates = { title, content };
        if (req.fileUrls) {
            const images = [];
            for (const file of req.fileUrls) {
                images.push(file);
            }
            updates.images = images;
        }
        const note = yield note_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        res.status(200).json(note);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateNoteById = updateNoteById;
// Delete a note by ID
const deleteNoteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const note = yield note_1.default.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: 'Note not found.' });
        }
        // Delete associated images and documents from Cloudinary
        const deleteImagePromises = (_b = (_a = note.attachments) === null || _a === void 0 ? void 0 : _a.imageUrls) === null || _b === void 0 ? void 0 : _b.map(image => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
            }
            return Promise.resolve(); // Handle cases where publicId is undefined
        }).filter(promise => promise !== undefined);
        const deleteDocumentPromises = (_d = (_c = note.attachments) === null || _c === void 0 ? void 0 : _c.documentUrls) === null || _d === void 0 ? void 0 : _d.map(doc => {
            var _a;
            const publicId = (_a = doc.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
            }
            return Promise.resolve(); // Handle cases where publicId is undefined
        }).filter(promise => promise !== undefined);
        yield Promise.all([...deleteImagePromises, ...deleteDocumentPromises]);
        yield note.deleteOne();
        res.status(200).json({ message: 'Note deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteNoteById = deleteNoteById;
