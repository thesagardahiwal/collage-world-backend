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
const dotenv_1 = require("dotenv");
const doubt_1 = __importDefault(require("../models/doubt"));
const answer_1 = __importDefault(require("../models/answer"));
const user_1 = __importDefault(require("../models/user"));
const faker_1 = require("@faker-js/faker");
(0, dotenv_1.config)();
const seedData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        yield mongoose_1.default.connect("mongodb://localhost:27017/collage-world");
        console.log('Database connected');
        yield doubt_1.default.deleteMany({});
        const users = yield user_1.default.find();
        // Create Doubts with Answers
        for (let i = 1; i <= 20; i++) {
            const asker = users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })]._id;
            const doubt = yield doubt_1.default.create({
                title: `Sample Doubt Title ${i}`,
                description: `This is a detailed description of doubt ${i}. It explains the problem in depth.`,
                tags: ['javascript', 'react', 'mongodb'],
                asker,
                images: [
                    `https://dummyimage.com/600x400/000/fff&text=Doubt+${i}`,
                    `https://dummyimage.com/600x400/000/fff&text=Example+Image`,
                ],
                views: Math.floor(Math.random() * 100),
            });
            const answers = [];
            for (let j = 1; j <= 3; j++) {
                const answerer = users[Math.floor(Math.random() * users.length)]._id;
                const answer = yield answer_1.default.create({
                    doubt: doubt._id,
                    answerer,
                    content: `This is answer ${j} for doubt ${i}. It provides a solution or explanation.`,
                    images: [
                        `https://dummyimage.com/600x400/000/fff&text=Answer+${j}`,
                        `https://dummyimage.com/600x400/000/fff&text=Solution+Image`,
                    ],
                });
                answers.push(answer._id);
            }
            doubt.answers = answers;
            yield doubt.save();
            console.log(`Doubt ${i} with answers created`);
        }
        console.log('Seeding complete');
        console.log('Sample resources added successfully.');
        console.log('Seeding complete');
        // Disconnect from MongoDB
        yield mongoose_1.default.disconnect();
    }
    catch (error) {
        console.error('Error seeding data:', error);
        yield mongoose_1.default.disconnect();
        process.exit(1);
    }
});
seedData();
