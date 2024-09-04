import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import { createNews, getAllNews, getNewsById, updateNewsById, deleteNewsById, adminDeleteNews } from '../controllers/newsController';
import { isTeacher, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Teacher routes
router.post('/', isTeacher, upload('images', 6), createNews); // Teachers can create news with up to 6 images
router.put('/:id', isTeacher, upload('images', 6), updateNewsById); // Teachers can update news
router.delete('/:id', isTeacher, deleteNewsById); // Teachers can delete their news

// Admin routes
router.delete('/admin/:id', isAdmin, adminDeleteNews); // Admins can delete any news

// Public routes
router.get('/', getAllNews); // Anyone can view all news
router.get('/:id', getNewsById); // Anyone can view a specific news

export default router;