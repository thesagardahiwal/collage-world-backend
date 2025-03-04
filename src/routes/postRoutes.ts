import express from 'express';
import { uploadFilesToCloudinary as upload } from '../config/claudinary';
import { createPost, getPostById, updatePostById, deletePostById, getAllPosts, adminDeletePost, getPostByUserId } from '../controllers/postController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();


router.get('/posts', isAuthenticated, getAllPosts);

// Route to create a post
router.post('/create', upload('images', 6), createPost);

router.get('/user-post/:id', isAuthenticated, getPostByUserId);
// Route to get a post by ID
router.get('/:id', isAuthenticated, getPostById);


// Route to update a post by ID
router.put('/:id', upload('images', 6), updatePostById);

// Route to delete a post by ID
router.delete('/:id', deletePostById);

// Admin routes
router.get('/admin', getAllPosts);  // Get all posts for admin
router.delete('/admin/:id', adminDeletePost);  // Admin delete any post

export default router;