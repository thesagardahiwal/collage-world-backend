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
exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const follow_1 = __importDefault(require("../models/follow"));
const user_1 = __importDefault(require("../models/user"));
// Follow a user
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.body; // The user to follow
        const followerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // The user who is following
        if (!followerId) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        if (userId === followerId.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }
        const existingFollow = yield follow_1.default.findOne({ follower: followerId, following: userId });
        if (existingFollow) {
            return res.status(400).json({ message: "You are already following this user" });
        }
        const follow = new follow_1.default({
            follower: followerId,
            following: userId,
        });
        yield follow.save();
        res.status(201).json({ message: "User followed successfully", follow });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.followUser = followUser;
// Unfollow a user
const unfollowUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.body; // The user to unfollow
        const followerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // The user who is unfollowing
        if (!followerId) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const follow = yield follow_1.default.findOneAndDelete({ follower: followerId, following: userId });
        if (!follow) {
            return res.status(404).json({ message: "You are not following this user" });
        }
        res.status(200).json({ message: "User unfollowed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.unfollowUser = unfollowUser;
const getFollowers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        ;
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No User" });
        }
        const followers = yield follow_1.default.find({ following: user._id }).populate("follower").populate("following");
        if (!followers) {
            return res.status(404).json({ message: "No Followers" });
        }
        res.status(200).json({ followers: followers });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getFollowers = getFollowers;
const getFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        ;
        const user = yield user_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "No User" });
        }
        ;
        const following = yield follow_1.default.find({ follower: user._id });
        if (!following) {
            return res.status(404).json({ message: "No following" });
        }
        ;
        res.status(200).json({ following: following });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getFollowing = getFollowing;
