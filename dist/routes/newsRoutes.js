"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const newsController_1 = require("../controllers/newsController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Teacher routes
router.post('/', authMiddleware_1.isTeacher, (0, claudinary_1.uploadFilesToCloudinary)('images', 6), newsController_1.createNews); // Teachers can create news with up to 6 images
router.put('/:id', authMiddleware_1.isTeacher, (0, claudinary_1.uploadFilesToCloudinary)('images', 6), newsController_1.updateNewsById); // Teachers can update news
router.delete('/:id', authMiddleware_1.isTeacher, newsController_1.deleteNewsById); // Teachers can delete their news
// Admin routes
router.delete('/admin/:id', authMiddleware_1.isAdmin, newsController_1.adminDeleteNews); // Admins can delete any news
// Public routes
router.get('/', newsController_1.getAllNews); // Anyone can view all news
router.get('/:id', newsController_1.getNewsById); // Anyone can view a specific news
exports.default = router;
