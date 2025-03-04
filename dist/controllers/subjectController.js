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
exports.getSubjectById = exports.getSubjects = exports.createSubject = void 0;
const subject_1 = __importDefault(require("../models/subject"));
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, educationField } = req.body;
        const subject = new subject_1.default({ name, educationField });
        yield subject.save();
        res.status(201).json(subject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createSubject = createSubject;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield subject_1.default.find().populate('educationField');
        res.status(200).json(subjects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSubjects = getSubjects;
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subject = yield subject_1.default.findById(req.params.id).populate('educationField');
        if (!subject)
            return res.status(404).json({ message: 'Subject not found' });
        res.status(200).json(subject);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getSubjectById = getSubjectById;
