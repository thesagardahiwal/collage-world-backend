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
exports.adminDeleteAnswerById = exports.deleteAnswerById = exports.updateAnswerById = exports.getAnswersByDoubtId = exports.postAnswer = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const answer_1 = __importDefault(require("../models/answer"));
const doubt_1 = __importDefault(require("../models/doubt"));
const helperClaudinary_1 = require("../utils/helperClaudinary");
// Post a new answer
const postAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const images = req.fileUrls;
        const answer = new answer_1.default({
            doubt: req.body.doubt,
            answerer: req.user._id,
            content: req.body.content,
            images,
        });
        const savedAnswer = yield answer.save();
        // Add the answer to the doubt's answers array
        yield doubt_1.default.findByIdAndUpdate(req.body.doubt, { $push: { answers: savedAnswer._id } });
        res.status(201).json(answer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.postAnswer = postAnswer;
// Get all answers for a specific doubt
const getAnswersByDoubtId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answers = yield answer_1.default.find({ doubt: req.params.doubtId }).populate('answerer');
        res.status(200).json(answers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAnswersByDoubtId = getAnswersByDoubtId;
// Update an answer by ID
const updateAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = {};
        if (req.fileUrls) {
            updates.images = req.fileUrls;
        }
        if (req.body.content)
            updates.content = req.body.content;
        const answer = yield answer_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found.' });
        }
        res.status(200).json(answer);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateAnswerById = updateAnswerById;
// Delete an answer by ID
const deleteAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answer = yield answer_1.default.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found.' });
        }
        // Delete associated images from Cloudinary
        yield Promise.all(answer.images.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy(`answers/${publicId}`);
            }
        }));
        yield answer.deleteOne();
        // Remove the answer from the doubt's answers array
        yield doubt_1.default.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });
        res.status(200).json({ message: 'Answer deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteAnswerById = deleteAnswerById;
// Admin: Delete an answer by ID
const adminDeleteAnswerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const answer = yield answer_1.default.findById(req.params.id);
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found.' });
        }
        // Delete associated images from Cloudinary
        yield Promise.all(answer.images.map((image) => {
            var _a;
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
            if (publicId) {
                return claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
            }
        }));
        yield answer.deleteOne();
        // Remove the answer from the doubt's answers array
        yield doubt_1.default.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });
        res.status(200).json({ message: 'Answer deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeleteAnswerById = adminDeleteAnswerById;
exports.voteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vote } = req.body; // `vote` should be +1 for upvote, -1 for downvote
        const answer = yield answer_1.default.findByIdAndUpdate(req.params.id, { $inc: { votes: vote } }, { new: true });
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }
        res.status(200).json(answer);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
