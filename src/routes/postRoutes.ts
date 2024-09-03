import express from 'express';
import { uploadPostImages, getPostById, updatePostById, deletePostById } from '../controllers/postController';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'collageWorld/' });  // Directory for temporary file storage

router.post('/posts/upload-images', upload.array('images', 6), uploadPostImages);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', upload.array('images', 6), updatePostById);
router.delete('/posts/:id', deletePostById);

export default router;