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
exports.deleteComment = exports.updateComment = exports.createComment = void 0;
const comment_1 = __importDefault(require("../models/comment"));
const post_1 = __importDefault(require("../models/post"));
// Create a new comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(500).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const post = yield post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const comment = new comment_1.default({
            post: postId,
            user: userId,
            content,
        });
        yield comment.save();
        res.status(201).json({ message: "Comment added successfully", comment });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.createComment = createComment;
// Update a comment
const updateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId, content } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(500).json({ message: "User not found!" });
        }
        const comment = yield comment_1.default.findOneAndUpdate({ _id: commentId, user: userId }, { content }, { new: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found or you're not authorized" });
        }
        res.status(200).json({ message: "Comment updated successfully", comment });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { commentId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(500).json({ message: "User not found!" });
        }
        const comment = yield comment_1.default.findOneAndDelete({ _id: commentId, user: userId });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found or you're not authorized" });
        }
        res.status(200).json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteComment = deleteComment;
