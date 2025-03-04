import express from 'express';
import { uploadFilesToCloudinary as upload } from '../config/claudinary';
import { 
  createPost, 
  getPostById, 
  updatePostById, 
  deletePostById, 
  getAllPosts, 
  adminDeletePost, 
  getPostByUserId 
} from '../controllers/postController';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   GET /api/posts
 * @desc    Get all posts (Authenticated users only)
 * @access  Private
 */
router.get('/', isAuthenticated, getAllPosts);

/**
 * @route   GET /api/posts/user/:userId
 * @desc    Get posts by a specific user (Authenticated users only)
 * @access  Private
 */
router.get('/user/:userId', isAuthenticated, getPostByUserId);

/**
 * @route   GET /api/posts/:id
 * @desc    Get a post by ID (Authenticated users only)
 * @access  Private
 */
router.get('/:id', isAuthenticated, getPostById);

/**
 * @route   POST /api/posts
 * @desc    Create a new post (Authenticated users only)
 * @access  Private
 */
router.post('/', isAuthenticated, upload('images', 6), createPost);

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post by ID (Authenticated users only)
 * @access  Private
 */
router.put('/:id', isAuthenticated, upload('images', 6), updatePostById);

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post by ID (Authenticated users only)
 * @access  Private
 */
router.delete('/:id', isAuthenticated, deletePostById);

/**
 * @route   GET /api/posts/admin
 * @desc    Get all posts (Admin only)
 * @access  Admin
 */
router.get('/admin', isAuthenticated, isAdmin, getAllPosts);

/**
 * @route   DELETE /api/posts/admin/:id
 * @desc    Admin delete any post
 * @access  Admin
 */
router.delete('/admin/:id', isAuthenticated, isAdmin, adminDeletePost);

export default router;
