import express from 'express';
import { createEducation, getEducation, getEducationById } from '../controllers/educationController';

const router = express.Router();

router.post('/education', createEducation);
router.get('/education', getEducation);
router.get('/education/:id', getEducationById);

export default router;