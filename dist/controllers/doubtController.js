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
exports.adminDeleteDoubtById = exports.deleteDoubtById = exports.getDoubtById = exports.getAllDoubts = exports.createDoubt = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const doubt_1 = __importDefault(require("../models/doubt"));
const helperClaudinary_1 = require("../utils/helperClaudinary");
// Create a new doubt
const createDoubt = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const images = req.fileUrls || [];
        const doubt = new doubt_1.default({
            title: req.body.title,
            description: req.body.description,
            asker: req.user._id,
            images,
        });
        yield doubt.save();
        res.status(201).json(doubt);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createDoubt = createDoubt;
// Get all doubts
const getAllDoubts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doubts = yield doubt_1.default.find().populate('asker').populate('answers');
        res.status(200).json({ doubts: doubts });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllDoubts = getAllDoubts;
// Get a doubt by ID
const getDoubtById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doubt = yield doubt_1.default.findById(req.params.id).populate('asker').populate({
            path: "answers",
            populate: {
                path: "answerer"
            }
        });
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found.' });
        }
        res.status(200).json({ doubtDetails: doubt });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getDoubtById = getDoubtById;
// Delete a doubt by ID
const deleteDoubtById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doubt = yield doubt_1.default.findById(req.params.id);
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found.' });
        }
        // Delete associated images from Cloudinary
        yield Promise.all(doubt.images.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy(`doubts/${publicId}`);
            }
            return Promise.resolve(null);
        }));
        yield doubt.deleteOne();
        res.status(200).json({ message: 'Doubt deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteDoubtById = deleteDoubtById;
// Admin: Delete a doubt by ID
const adminDeleteDoubtById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doubt = yield doubt_1.default.findById(req.params.id);
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found.' });
        }
        // Delete associated images from Cloudinary
        yield Promise.all(doubt.images.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
            }
            ;
            return Promise.resolve(null);
        }));
        yield doubt.deleteOne();
        res.status(200).json({ message: 'Doubt deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeleteDoubtById = adminDeleteDoubtById;
exports.voteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vote } = req.body; // `vote` should be +1 for upvote, -1 for downvote
        const question = yield doubt_1.default.findByIdAndUpdate(req.params.id, { $inc: { votes: vote } }, { new: true });
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.status(200).json(question);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
