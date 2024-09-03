import { Router } from 'express';
import { uploadStudentId } from '../controllers/userController';
import { authenticate } from '../utils/middleware';

const router = Router();

router.post('/upload-student-id', authenticate, uploadStudentId);

export default router;