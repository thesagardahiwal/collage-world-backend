import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import { 
  createNews, 
  getAllNews, 
  getNewsById, 
  updateNewsById, 
  deleteNewsById, 
  adminDeleteNews 
} from '../controllers/newsController';
import { isTeacher, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/news
 * @desc    Create a news post (Teacher only)
 * @access  Private (Teachers)
 */
router.post('/', isTeacher, upload('images', 6), createNews);

/**
 * @route   GET /api/news
 * @desc    Get all news
 * @access  Public
 */
router.get('/', getAllNews);

/**
 * @route   GET /api/news/:id
 * @desc    Get a specific news post by ID
 * @access  Public
 */
router.get('/:id', getNewsById);

/**
 * @route   PUT /api/news/:id
 * @desc    Update a news post (Teacher only)
 * @access  Private (Teachers)
 */
router.put('/:id', isTeacher, upload('images', 6), updateNewsById);

/**
 * @route   DELETE /api/news/:id
 * @desc    Delete a news post (Teacher only)
 * @access  Private (Teachers)
 */
router.delete('/:id', isTeacher, deleteNewsById);

/**
 * @route   DELETE /api/news/admin/:id
 * @desc    Delete any news post (Admin only)
 * @access  Private (Admins)
 */
router.delete('/admin/:id', isAdmin, adminDeleteNews);

export default router;
