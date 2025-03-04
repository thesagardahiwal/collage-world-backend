import { Router } from 'express';
import { uploadStudentId, getUserDetails, getAllUsers } from '../controllers/userController';
import { authenticate } from '../utils/middleware';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

router.post('/upload-student-id', authenticate, uploadStudentId);
router.get('/', isAuthenticated, getAllUsers);
router.get('/:username', isAuthenticated, getUserDetails);

export default router;