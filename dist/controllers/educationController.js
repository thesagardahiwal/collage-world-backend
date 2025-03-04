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
exports.getEducationById = exports.getEducation = exports.createEducation = void 0;
const education_1 = __importDefault(require("../models/education"));
const createEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, subjects } = req.body;
        const education = new education_1.default({ name, subjects });
        yield education.save();
        res.status(201).json(education);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createEducation = createEducation;
const getEducation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education = yield education_1.default.find().populate('subjects');
        res.status(200).json(education);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEducation = getEducation;
const getEducationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const education = yield education_1.default.findById(req.params.id).populate('subjects');
        if (!education)
            return res.status(404).json({ message: 'Education not found' });
        res.status(200).json(education);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getEducationById = getEducationById;
