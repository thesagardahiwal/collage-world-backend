"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/posts', authMiddleware_1.isAuthenticated, postController_1.getAllPosts);
// Route to create a post
router.post('/create', (0, claudinary_1.uploadFilesToCloudinary)('images', 6), postController_1.createPost);
// Route to get a post by ID
router.get('/:id', postController_1.getPostById);
// Route to update a post by ID
router.put('/:id', (0, claudinary_1.uploadFilesToCloudinary)('images', 6), postController_1.updatePostById);
// Route to delete a post by ID
router.delete('/:id', postController_1.deletePostById);
// Admin routes
router.get('/admin', postController_1.getAllPosts); // Get all posts for admin
router.delete('/admin/:id', postController_1.adminDeletePost); // Admin delete any post
exports.default = router;
