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
// Import Like model
const faker_1 = require("@faker-js/faker");
const mongoose_1 = __importDefault(require("mongoose"));
const comment_1 = __importDefault(require("../models/comment"));
const like_1 = __importDefault(require("../models/like"));
const reels_1 = __importDefault(require("../models/reels"));
const user_1 = __importDefault(require("../models/user"));
function seedDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        // Connect to MongoDB
        yield mongoose_1.default.connect('mongodb://localhost:27017/collage-world');
        // Delete existing data
        //   await User.deleteMany({});
        yield reels_1.default.deleteMany({});
        yield comment_1.default.deleteMany({});
        yield like_1.default.deleteMany({});
        //   // Generate 10 sample users
        //   const userDocs = [];
        //   for (let i = 0; i < 30; i++) { // 30 users
        //     userDocs.push({
        //       username: faker.internet.userName(),
        //       name: faker.name.fullName(),
        //       bio: faker.lorem.sentence(),
        //       email: faker.internet.email(),
        //       password: faker.internet.password(),
        //       stream: faker.internet.url(),
        //       profilePhoto: faker.image.avatar(),
        //       inAppCurrency: faker.number.int({ min: 0, max: 1000 }),
        //     });
        //   }
        //   await User.insertMany(userDocs);
        //   const savedUsers = await User.insertMany(userDocs);
        // Generate 10 sample reels
        const dummyVideoUrls = [
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        ];
        const savedUsers = yield user_1.default.find();
        const reels = [];
        for (let i = 0; i < 10; i++) {
            const userId = savedUsers[faker_1.faker.number.int({ min: 0, max: savedUsers.length - 1 })]._id;
            reels.push({
                user: userId,
                videoUrl: dummyVideoUrls[faker_1.faker.number.int({ min: 0, max: 9 })],
                description: faker_1.faker.lorem.sentence(),
                hashtags: [faker_1.faker.lorem.word(), faker_1.faker.lorem.word()],
                music: faker_1.faker.lorem.word(),
            });
        }
        const savedReels = yield reels_1.default.insertMany(reels);
        // Generate 14 comments and 29 likes for each reel
        for (let reel of savedReels) {
            const comments = [];
            const likes = [];
            for (let j = 0; j < 14; j++) {
                comments.push({
                    targetType: 'Reel',
                    targetId: reel._id,
                    user: savedUsers[faker_1.faker.number.int({ min: 0, max: 29 })]._id,
                    content: faker_1.faker.lorem.sentence(),
                    likes: [],
                    replies: [],
                });
            }
            yield comment_1.default.insertMany(comments);
            for (let j = 0; j < 29; j++) {
                likes.push({
                    targetType: 'Reel',
                    targetId: reel._id,
                    user: savedUsers[faker_1.faker.number.int({ min: 0, max: 29 })]._id,
                });
            }
            yield like_1.default.insertMany(likes);
        }
        console.log('Database seeded successfully!');
        mongoose_1.default.disconnect();
    });
}
seedDatabase();
