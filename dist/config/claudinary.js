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
exports.uploadFilesToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer configuration for memory storage
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Middleware to upload multiple files to Cloudinary
const uploadFilesToCloudinary = (fieldName, maxCount) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        upload.array(fieldName, maxCount)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return res.status(400).json({ message: 'Error uploading files.' });
            }
            if (!req.files || req.files.length === 0) {
                return next(); // No files uploaded, proceed to the next middleware
            }
            try {
                const uploadPromises = req.files.map((file) => uploadFile(file));
                const results = yield Promise.all(uploadPromises);
                req.fileUrls = results.map((result) => result.secure_url);
                next();
            }
            catch (error) {
                return res.status(500).json({ message: 'Error processing files.', error });
            }
        }));
    });
};
exports.uploadFilesToCloudinary = uploadFilesToCloudinary;
// Upload file to Cloudinary
const uploadFile = (file) => {
    const resourceType = getResourceType(file.mimetype);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: 'uploads/', // Customize as needed
            resource_type: resourceType,
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        uploadStream.end(file.buffer);
    });
};
// Determine resource type based on MIME type
const getResourceType = (mimeType) => {
    if (mimeType.startsWith('image/')) {
        return 'image';
    }
    else if (mimeType.startsWith('video/')) {
        return 'video';
    }
    else {
        return 'raw'; // For documents and other file types
    }
};
// Export Cloudinary instance
exports.default = cloudinary_1.v2;
