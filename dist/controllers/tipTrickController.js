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
exports.adminDeleteTipTrickById = exports.adminGetAllTipsTricks = exports.deleteTipTrickById = exports.updateTipTrickById = exports.getTipTrickById = exports.getAllTipsTricks = exports.createTipTrick = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const tipTrick_1 = __importDefault(require("../models/tipTrick"));
// Upload a new tip or trick
const createTipTrick = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let imageUrls = [];
        if (req.fileUrls) {
            const images = req.files;
            const uploadPromises = images.map((file) => {
                return claudinary_1.default.uploader.upload(file.path, {
                    folder: 'tips_tricks',
                    resource_type: 'image'
                }).then((result) => result.secure_url);
            });
            imageUrls = yield Promise.all(uploadPromises);
        }
        const tipTrick = new tipTrick_1.default({
            title: req.body.title,
            description: req.body.description,
            topic: req.body.topic,
            imageUrls
        });
        yield tipTrick.save();
        res.status(201).json(tipTrick);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createTipTrick = createTipTrick;
// Get all tips and tricks
const getAllTipsTricks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipsTricks = yield tipTrick_1.default.find();
        res.status(200).json(tipsTricks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllTipsTricks = getAllTipsTricks;
// Get a tip or trick by ID
const getTipTrickById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipTrick = yield tipTrick_1.default.findById(req.params.id);
        if (!tipTrick) {
            return res.status(404).json({ message: 'Tip or trick not found.' });
        }
        res.status(200).json(tipTrick);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getTipTrickById = getTipTrickById;
// Update a tip or trick by ID
const updateTipTrickById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = {};
        if (req.body.title)
            updates.title = req.body.title;
        if (req.body.description)
            updates.description = req.body.description;
        if (req.body.topic)
            updates.topic = req.body.topic;
        if (req.fileUrls) {
            const images = req.files;
            const uploadPromises = images.map((file) => {
                return claudinary_1.default.uploader.upload(file.path, {
                    folder: 'tips_tricks',
                    resource_type: 'image'
                }).then((result) => result.secure_url);
            });
            updates.imageUrls = yield Promise.all(uploadPromises);
        }
        const tipTrick = yield tipTrick_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!tipTrick) {
            return res.status(404).json({ message: 'Tip or trick not found.' });
        }
        res.status(200).json(tipTrick);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateTipTrickById = updateTipTrickById;
// Delete a tip or trick by ID
const deleteTipTrickById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tipTrick = yield tipTrick_1.default.findById(req.params.id);
        if (!tipTrick) {
            return res.status(404).json({ message: 'Tip or trick not found.' });
        }
        // Delete associated images from Cloudinary
        const deletePromises = (_a = tipTrick.imageUrls) === null || _a === void 0 ? void 0 : _a.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy(`tips_tricks/${publicId}`);
            }
            return Promise.resolve(); // Handle cases where publicId is undefined
        }).filter(promise => promise !== undefined);
        yield Promise.all(deletePromises);
        yield tipTrick.deleteOne();
        res.status(200).json({ message: 'Tip or trick deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteTipTrickById = deleteTipTrickById;
// Admin: Get all tips and tricks with their images
const adminGetAllTipsTricks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tipsTricks = yield tipTrick_1.default.find();
        res.status(200).json(tipsTricks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminGetAllTipsTricks = adminGetAllTipsTricks;
// Admin: Delete a tip or trick by ID
const adminDeleteTipTrickById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const tipTrick = yield tipTrick_1.default.findById(req.params.id);
        if (!tipTrick) {
            return res.status(404).json({ message: 'Tip or trick not found.' });
        }
        // Delete associated images from Cloudinary
        const deletePromises = (_a = tipTrick.imageUrls) === null || _a === void 0 ? void 0 : _a.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy(`tips_tricks/${publicId}`);
            }
            return Promise.resolve(); // Handle cases where publicId is undefined
        }).filter(promise => promise !== undefined);
        yield Promise.all(deletePromises);
        yield tipTrick.deleteOne();
        res.status(200).json({ message: 'Tip or trick deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeleteTipTrickById = adminDeleteTipTrickById;
