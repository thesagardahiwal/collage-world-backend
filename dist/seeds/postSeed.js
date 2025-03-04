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
const post_1 = __importDefault(require("../models/post")); // Adjust path as necessary
const comment_1 = __importDefault(require("../models/comment")); // Adjust path as necessary
const like_1 = __importDefault(require("../models/like")); // Adjust path as necessary
const faker_1 = require("@faker-js/faker");
const seedPosts = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb://localhost:27017/collage-world'); // Replace with your database connection string
        // Fetch all users
        const users = yield user_1.default.find().lean(); // Use .lean() to simplify _id handling
        if (!users.length) {
            console.error('No users found. Add some users first.');
            process.exit(1);
        }
        const imageUrls = [
            "https://images.unsplash.com/photo-1542744095-291d1f67b221",
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
            "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
            "https://images.unsplash.com/photo-1501769214405-6c0836abf376",
            "https://images.unsplash.com/photo-1488826701980-7c1a5f9a1af5",
            "https://images.unsplash.com/photo-1542224566-6e1f24c6b7c5",
            "https://images.unsplash.com/photo-1547721064-da6cfb341d50",
            "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
            "https://images.unsplash.com/photo-1514820720301-4c479edb8510",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            "https://images.unsplash.com/photo-1495490140452-5a226aef25d2",
            "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
            "https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa",
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
            "https://images.unsplash.com/photo-1463453091185-61582044d556",
            "https://images.unsplash.com/photo-1472417583565-62e7bdeda490",
            "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
            "https://images.unsplash.com/photo-1465101046530-73398c7f28c7",
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
        ];
        // Clear existing post, comment, and like data
        yield post_1.default.deleteMany();
        const posts = [];
        const comments = [];
        const likes = [];
        users.forEach((user) => {
            const userId = new mongoose_1.default.Types.ObjectId(user._id);
            // Create 5 posts per user
            for (let i = 0; i < 5; i++) {
                const post = new post_1.default({
                    title: `Post Title ${i + 1} by ${user.username}`,
                    content: `This is the content of post ${i + 1} by ${user.username}.`,
                    tags: [`tag${i + 1}`, `tag${i + 2}`],
                    images: [imageUrls[faker_1.faker.number.int({ min: 0, max: 3 })],
                        imageUrls[faker_1.faker.number.int({ min: 4, max: 6 })],
                        imageUrls[faker_1.faker.number.int({ min: 10, max: 12 })],
                        imageUrls[faker_1.faker.number.int({ min: 13, max: imageUrls.length - 1 })],
                        imageUrls[faker_1.faker.number.int({ min: 7, max: 9 })]], // Replace with actual image URLs
                    author: userId,
                    private: false, // Randomly set some posts as private
                });
                posts.push(post);
                // Create 3 comments per post
                for (let j = 0; j < 3; j++) {
                    const comment = new comment_1.default({
                        targetType: 'Post',
                        targetId: post._id,
                        user: userId,
                        content: `This is comment ${j + 1} on post ${i + 1} by ${user.username}.`,
                    });
                    post.comment.push(comment._id); // Link comments to the post
                }
                // Add 1 to 25 likes per post
                const likeCount = Math.floor(Math.random() * 25) + 1;
                const shuffledUsers = users.sort(() => 0.5 - Math.random()); // Randomize users
                shuffledUsers.slice(0, likeCount).forEach((liker) => {
                    const like = {
                        targetType: 'Post',
                        targetId: post._id,
                        user: new mongoose_1.default.Types.ObjectId(liker._id),
                    };
                    likes.push(like);
                    post.likes.push(like.user); // Link likes to the post
                });
            }
        });
        // Insert posts, comments, and likes into the database
        yield post_1.default.insertMany(posts);
        yield comment_1.default.insertMany(comments);
        yield like_1.default.insertMany(likes);
        console.log(`${posts.length} posts, ${comments.length} comments, and ${likes.length} likes created.`);
        // Close the database connection
        yield mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding posts:', error);
        process.exit(1);
    }
});
seedPosts();
