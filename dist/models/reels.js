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
const like_1 = __importDefault(require("./like")); // Import Like model
const ReelSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    videoUrl: {
        type: String,
        required: true,
    },
    thumbnailUrl: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 500, // Limit description to 500 characters
    },
    hashtags: [
        {
            type: String,
            lowercase: true,
        },
    ],
    music: {
        type: String,
    },
    likes: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Like', // Reference to the Like model
        },
    ],
    comments: [
        {
            type: mongoose_1.default.Types.ObjectId,
            ref: 'Comment', // Reference to the Comment model
        },
    ],
    views: {
        type: Number,
        default: 0,
    },
    shares: {
        type: Number,
        default: 0,
    },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});
// Middleware for cleaning up associated data when deleting a reel
ReelSchema.pre('deleteOne', { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reelId = this._id;
            // Delete related comments
            yield comment_1.default.deleteMany({ targetId: reelId });
            // Delete related likes
            yield like_1.default.deleteMany({ targetId: reelId });
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
const Reel = mongoose_1.default.model('Reel', ReelSchema);
exports.default = Reel;
