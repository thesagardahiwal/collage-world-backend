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
exports.adminDeleteNews = exports.deleteNewsById = exports.updateNewsById = exports.getNewsById = exports.getAllNews = exports.createNews = void 0;
const claudinary_1 = __importDefault(require("../config/claudinary"));
const news_1 = __importDefault(require("../models/news"));
// Create news
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        const images = req.fileUrls || [];
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const news = new news_1.default({
            title,
            content,
            createdBy: req.user._id, // Assuming user is attached to req
            images,
        });
        yield news.save();
        res.status(201).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.createNews = createNews;
// Get all news
const getAllNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsList = yield news_1.default.find().populate('createdBy', 'name');
        res.status(200).json(newsList);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllNews = getAllNews;
// Get news by ID
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const news = yield news_1.default.findById(req.params.id).populate('createdBy', 'name');
        if (!news) {
            return res.status(404).json({ message: 'News not found.' });
        }
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getNewsById = getNewsById;
// Update news by ID
const updateNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const news = yield news_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!news) {
            return res.status(404).json({ message: 'News not found.' });
        }
        res.status(200).json(news);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateNewsById = updateNewsById;
// Delete news by ID
const deleteNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const news = yield news_1.default.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found.' });
        }
        // Delete associated images from Cloudinary
        if (news.images && news.images.length > 0) {
            for (const imageUrl of news.images) {
                const publicId = (_a = imageUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
                if (publicId) {
                    yield claudinary_1.default.uploader.destroy(`news/${publicId}`);
                }
            }
        }
        yield news.deleteOne();
        res.status(200).json({ message: 'News deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteNewsById = deleteNewsById;
// Admin: Delete any news
const adminDeleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const news = yield news_1.default.findById(req.params.id);
        if (!news) {
            return res.status(404).json({ message: 'News not found.' });
        }
        // Delete associated images from Cloudinary
        if (news.images && news.images.length > 0) {
            for (const imageUrl of news.images) {
                const publicId = (_a = imageUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift();
                if (publicId) {
                    yield claudinary_1.default.uploader.destroy(`news/${publicId}`);
                }
            }
        }
        yield news.deleteOne();
        res.status(200).json({ message: 'News deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeleteNews = adminDeleteNews;
