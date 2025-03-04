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
exports.unlikePost = exports.likePost = void 0;
const like_1 = __importDefault(require("../models/like"));
const post_1 = __importDefault(require("../models/post"));
// Like a post
const likePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const post = yield post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const existingLike = yield like_1.default.findOne({ post: postId, user: userId });
        if (existingLike) {
            return res.status(400).json({ message: "You have already liked this post" });
        }
        const like = new like_1.default({
            post: postId,
            user: userId,
        });
        yield like.save();
        res.status(201).json({ message: "Post liked successfully", like });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.likePost = likePost;
// Unlike a post
const unlikePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const like = yield like_1.default.findOneAndDelete({ post: postId, user: userId });
        if (!like) {
            return res.status(404).json({ message: "You haven't liked this post yet" });
        }
        res.status(200).json({ message: "Post unliked successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.unlikePost = unlikePost;
