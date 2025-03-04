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
exports.adminDeletePost = exports.getAllPosts = exports.deletePostById = exports.updatePostById = exports.getPostById = exports.createPost = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const post_1 = __importDefault(require("../models/post"));
const helperClaudinary_1 = require("../utils/helperClaudinary");
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const images = req.fileUrls || [];
        const post = new post_1.default({
            title,
            content,
            images,
            author: req.body.author, // Assuming author ID is provided in the request body
        });
        yield post.save();
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createPost = createPost;
// Get a post by ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.default.findById(req.params.id).populate('author');
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getPostById = getPostById;
// Update a post by ID
const updatePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const updates = {};
        const { title, content } = req.body;
        if (title)
            updates.title = title;
        if (content)
            updates.content = content;
        if ((_a = req.fileUrls) === null || _a === void 0 ? void 0 : _a.length) {
            const images = [];
            for (let file of req.fileUrls) {
                images.push(req.fileUrls);
            }
            if (images.length > 0) {
                updates.images = images;
            }
        }
        const post = yield post_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updatePostById = updatePostById;
// Delete a post by ID
const deletePostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Delete associated images from Cloudinary
        for (const image of post.images) {
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift(); // Extract public ID from URL
            if (publicId) {
                yield claudinary_1.default.uploader.destroy(`posts/${publicId}`);
            }
        }
        yield post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deletePostById = deletePostById;
// Admin: Get all posts
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.default.find().populate('author');
        res.status(200).json({ posts: posts });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllPosts = getAllPosts;
// Admin: Delete any post
const adminDeletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield post_1.default.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        // Delete associated images from Cloudinary
        for (const image of post.images) {
            const publicId = (_a = image.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift(); // Extract public ID from URL
            if (publicId) {
                yield claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
            }
        }
        yield post.deleteOne();
        res.status(200).json({ message: 'Post deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeletePost = adminDeletePost;
