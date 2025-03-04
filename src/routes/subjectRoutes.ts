import express from 'express';
import { createSubject, getSubjects, getSubjectById } from '../controllers/subjectController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/subjects
 * @desc    Create a new subject
 * @access  Private (Authenticated users only)
 */
router.post('/', isAuthenticated, createSubject);

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects
 * @access  Public
 */
router.get('/', getSubjects);

/**
 * @route   GET /api/subjects/:id
 * @desc    Get a subject by ID
 * @access  Public
 */
router.get('/:id', getSubjectById);

export default router;
