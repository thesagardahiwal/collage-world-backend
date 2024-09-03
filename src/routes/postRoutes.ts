import express from 'express';
import multer from 'multer';
import { createPost, getPostById, updatePostById, deletePostById, getAllPosts, adminDeletePost } from '../controllers/postController';

const router = express.Router();
const upload = multer({ dest: 'collageWorld/' });  // Directory for temporary file storage

// Route to create a post
router.post('/create', upload.array('images', 6), createPost);

// Route to get a post by ID
router.get('/:id', getPostById);

// Route to update a post by ID
router.put('/:id', upload.array('images', 6), updatePostById);

// Route to delete a post by ID
router.delete('/:id', deletePostById);

// Admin routes
router.get('/admin', getAllPosts);  // Get all posts for admin
router.delete('/admin/:id', adminDeletePost);  // Admin delete any post

export default router;