"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
const comment_1 = __importDefault(require("./comment")); // Import Comment model
const like_1 = __importDefault(require("./like"));
const save_1 = __importDefault(require("./save"));
const PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [String],
    images: [{ type: String }], // Array of image URLs
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    private: { type: Boolean, default: false },
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Like', // Reference to the Like model
        },
    ],
    comment: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Comment"
        }
    ],
    saved: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: "Save"
        }
    ]
}, { timestamps: true });
const Post = mongoose_1.default.model('Post', PostSchema);
// Middleware to cascade delete post-related data
PostSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = this._id;
            // Delete related comments
            yield comment_1.default.deleteMany({ targetId: postId });
            // Delete related likes
            yield like_1.default.deleteMany({ targetId: postId });
            // Delete related saves
            yield save_1.default.deleteMany({ post: postId });
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
exports.default = Post;
