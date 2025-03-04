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
exports.adminDeleteResource = exports.getAllResources = exports.deleteResourceById = exports.updateResourceById = exports.getResourceById = exports.uploadResource = void 0;
const helperClaudinary_1 = require("../utils/helperClaudinary");
const claudinary_1 = __importDefault(require("../config/claudinary")); // Import Cloudinary setup
const eduResource_1 = __importDefault(require("../models/eduResource"));
// Upload a new resource
const uploadResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.fileUrls) === null || _a === void 0 ? void 0 : _a.length)) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized access. Please provide valid authentication credentials." });
        }
        const resource = new eduResource_1.default({
            title: req.body.title,
            description: req.body.description,
            fileUrl: req.fileUrls[0],
            resourceType: (0, helperClaudinary_1.getResourceTypeFromUrl)(req.fileUrls[0]),
            uploadedBy: req.user._id, // Assuming `req.user` contains the authenticated user's info
            educationField: req.body.educationField,
            subject: req.body.subject,
        });
        yield resource.save();
        res.status(201).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.uploadResource = uploadResource;
// Get a resource by ID
const getResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = yield eduResource_1.default.findById(req.params.id)
            .populate('educationField')
            .populate('subject');
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getResourceById = getResourceById;
// Update a resource by ID
const updateResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updates = {};
        if (req.body.title)
            updates.title = req.body.title;
        if (req.body.description)
            updates.description = req.body.description;
        if (req.body.educationField)
            updates.educationField = req.body.educationField;
        if (req.body.subject)
            updates.subject = req.body.subject;
        const resource = yield eduResource_1.default.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        res.status(200).json(resource);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateResourceById = updateResourceById;
// Delete a resource by ID
const deleteResourceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const resource = yield eduResource_1.default.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        // Delete associated file from Cloudinary
        const publicId = (_a = resource.fileUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift(); // Extract public ID from URL
        if (publicId) {
            yield claudinary_1.default.uploader.destroy((0, helperClaudinary_1.getLocationOfFile)(publicId));
        }
        yield resource.deleteOne();
        res.status(200).json({ message: 'Resource deleted successfully.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.deleteResourceById = deleteResourceById;
// Admin: Get all resources
const getAllResources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resources = yield eduResource_1.default.find()
            .populate('educationField')
            .populate('subject');
        res.status(200).json(resources);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAllResources = getAllResources;
// Admin: Delete any resource
const adminDeleteResource = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const resource = yield eduResource_1.default.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found.' });
        }
        // Delete associated file from Cloudinary
        const publicId = (_a = resource.fileUrl.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('.').shift(); // Extract public ID from URL
        if (publicId) {
            yield claudinary_1.default.uploader.destroy(`resources/${publicId}`);
        }
        yield resource.deleteOne();
        res.status(200).json({ message: 'Resource deleted successfully by admin.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.adminDeleteResource = adminDeleteResource;
