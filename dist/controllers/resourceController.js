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
exports.getStreamResources = exports.removeResources = exports.getResources = exports.createResource = void 0;
const resource_1 = __importDefault(require("../models/resource"));
const createResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, subject, examType, resourceType, pdfUrl } = req.body;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!user) {
            return res.status(404).json({ message: "User is not fount!" });
        }
        const newResource = new resource_1.default({ title, subject, examType, resourceType, pdfUrl, author: user });
        yield newResource.save();
        const modifiedResource = newResource.populate('author', 'name');
        res.status(201).json(modifiedResource);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.createResource = createResource;
const getResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subject, examType } = req.query;
    try {
        if (!subject && !examType) {
            const resources = yield resource_1.default.find().populate('author', 'name');
            if (!resources) {
                return res.status(400).json({ message: "No resources!" });
            }
            return res.status(200).json({ resources });
        }
        const resources = yield resource_1.default.find({ subject, examType });
        return res.status(200).json(resources);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getResources = getResources;
const removeResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    try {
        const user = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!user) {
            return res.status(401).json({ message: "User is not found!" });
        }
        const resource = yield resource_1.default.findOne({ _id: id });
        if (!resource) {
            return res.status(400).json({ message: "Not Fount!" });
        }
        if (resource.author.toString() != user) {
            return res.status(400).json({ message: "You are not author of this resource." });
        }
        yield resource_1.default.deleteOne({ _id: resource._id });
        res.status(200).json("DELETD!");
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.removeResources = removeResources;
const getStreamResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stream } = req.params;
        if (stream) {
            const resources = yield resource_1.default.find({ stream });
            if (resources.length > 0) {
                return res.status(200).json({ resources: resources });
            }
        }
        ;
        const resources = yield resource_1.default.find().populate("author");
        res.status(200).json({ resources: resources });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getStreamResources = getStreamResources;
