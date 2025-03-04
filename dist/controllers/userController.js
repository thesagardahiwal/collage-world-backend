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
exports.getAllUsers = exports.getUserDetails = exports.uploadStudentId = void 0;
const claudinary_1 = require("../config/claudinary");
const user_1 = __importDefault(require("../models/user"));
const mlService_1 = __importDefault(require("../services/mlService"));
exports.uploadStudentId = [(0, claudinary_1.uploadFilesToCloudinary)('studentId', 1), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.userId;
        try {
            if (!userId) {
                return res.status(400).json({ error: 'User ID is missing' });
            }
            // Check if file is present
            if (!req.fileUrls) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const result = yield mlService_1.default.verifyStudentId(req.fileUrls[0]);
            const isStudent = result.isStudent;
            yield user_1.default.findByIdAndUpdate(userId, { isStudent, studentId: req.fileUrls[0] });
            res.json({ isStudent });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    })];
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const userDetails = yield user_1.default.findOne({ username: username });
        res.status(200).json({ userDetails: userDetails });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getUserDetails = getUserDetails;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find().limit(20);
        return res.status(200).json({ users: users });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllUsers = getAllUsers;
