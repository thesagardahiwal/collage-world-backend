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
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("../models/user")); // Adjust path as necessary
const follow_1 = __importDefault(require("../models/follow")); // Adjust path as necessary
const seedFollows = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb://localhost:27017/collage-world'); // Replace with your database connection string
        // Fetch all users
        const users = yield user_1.default.find().lean(); // Use .lean() to simplify _id handling
        if (users.length < 2) {
            console.error('Not enough users to create follow relationships.');
            process.exit(1);
        }
        // Clear existing follow data
        yield follow_1.default.deleteMany();
        const followData = [];
        users.forEach((follower) => {
            const followerId = new mongoose_1.default.Types.ObjectId(follower._id); // Ensure _id is correctly typed
            const potentialFollowings = users.filter((user) => user._id.toString() !== followerId.toString());
            // Randomize and pick some users to follow
            const followCount = Math.floor(Math.random() * (potentialFollowings.length / 2)) + 1; // Ensures not all users are followed
            const selectedFollowings = potentialFollowings.sort(() => 0.5 - Math.random()).slice(0, followCount);
            selectedFollowings.forEach((following) => {
                const followingId = new mongoose_1.default.Types.ObjectId(following._id); // Ensure _id is correctly typed
                followData.push({
                    follower: followerId,
                    following: followingId,
                    createdAt: new Date(),
                });
            });
        });
        // Insert follow data
        yield follow_1.default.insertMany(followData);
        console.log(`${followData.length} follow relationships created.`);
        // Close the database connection
        yield mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding follow data:', error);
        process.exit(1);
    }
});
seedFollows();
