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
const resource_1 = __importDefault(require("../models/resource"));
const like_1 = __importDefault(require("../models/like"));
const review_1 = __importDefault(require("../models/review"));
const comment_1 = __importDefault(require("../models/comment"));
const user_1 = __importDefault(require("../models/user"));
const faker_1 = require("@faker-js/faker");
const pdfUrls = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf",
    "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
    "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    "https://www.clickdimensions.com/links/TestPDFfile.pdf",
    "https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf",
    "https://www.africau.edu/images/default/sample.pdf",
    "https://filesamples.com/samples/document/pdf/sample3.pdf",
    "https://www.gutenberg.org/files/1342/1342-h/1342-h.pdf", // Pride and Prejudice
    "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
];
const seedResources = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect('mongodb://localhost:27017/collage-world');
        // Clear existing data
        const users = yield user_1.default.find();
        yield resource_1.default.deleteMany({});
        for (let i = 1; i <= 10; i++) {
            // Create a resource
            const resource = new resource_1.default({
                title: `Resource ${i}`,
                subject: `Subject ${i}`,
                examType: `ExamType ${i}`,
                resourceType: `ResourceType ${i}`,
                stream: `Stream ${i}`,
                pdfUrl: pdfUrls[faker_1.faker.number.int({ min: 0, max: pdfUrls.length - 1 })],
                likes: [],
                review: [],
                comment: [],
                author: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })],
            });
            // Create 20 likes for the resource
            for (let j = 0; j < 20; j++) {
                const like = new like_1.default({
                    targetType: 'Resource',
                    targetId: resource._id,
                    user: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })],
                });
                yield like.save();
                resource.likes.push(like._id);
            }
            ;
            // Create 5 reviews for the resource
            for (let j = 0; j < 5; j++) {
                const review = new review_1.default({
                    targetType: 'Resource',
                    targetId: resource._id,
                    user: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })],
                    rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
                });
                yield review.save();
                resource.review.push(review._id);
            }
            // Create 3 comments for the resource
            for (let j = 0; j < 3; j++) {
                const comment = new comment_1.default({
                    targetType: 'Resource',
                    targetId: resource._id,
                    user: users[faker_1.faker.number.int({ min: 0, max: users.length - 1 })],
                    content: `This is comment ${j + 1} on resource ${i}`,
                });
                yield comment.save();
                resource.comment.push(comment._id);
            }
            yield resource.save();
        }
        console.log('Seed data successfully added.');
    }
    catch (error) {
        console.error('Error seeding data:', error);
    }
});
seedResources();
