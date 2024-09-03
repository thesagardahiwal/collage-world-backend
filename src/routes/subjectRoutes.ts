import express from 'express';
import { createSubject, getSubjects, getSubjectById } from '../controllers/subjectController';

const router = express.Router();

router.post('/subjects', createSubject);
router.get('/subjects', getSubjects);
router.get('/subjects/:id', getSubjectById);

export default router;