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
exports.unsavePost = exports.savePost = void 0;
const save_1 = __importDefault(require("../models/save"));
const post_1 = __importDefault(require("../models/post"));
// Save a post
const savePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(500).json({ message: "User not found!" });
        }
        const post = yield post_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const existingSave = yield save_1.default.findOne({ post: postId, user: userId });
        if (existingSave) {
            return res.status(400).json({ message: "You have already saved this post" });
        }
        const save = new save_1.default({
            post: postId,
            user: userId,
        });
        yield save.save();
        res.status(201).json({ message: "Post saved successfully", save });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.savePost = savePost;
// Unsave a post
const unsavePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const save = yield save_1.default.findOneAndDelete({ post: postId, user: userId });
        if (!save) {
            return res.status(404).json({ message: "You haven't saved this post yet" });
        }
        res.status(200).json({ message: "Post unsaved successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.unsavePost = unsavePost;
