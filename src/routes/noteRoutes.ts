import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import { 
  createNote, 
  getAllNotes, 
  getNoteById, 
  updateNoteById, 
  deleteNoteById 
} from '../controllers/noteController';
import { isAuthenticated } from '../middlewares/authMiddleware'; 

const router = express.Router();

/**
 * @route   POST /api/notes
 * @desc    Create a new note (Authenticated users only)
 * @access  Private
 */
router.post('/', isAuthenticated, upload('attachments', 6), createNote);

/**
 * @route   GET /api/notes
 * @desc    Get all notes (Authenticated users only)
 * @access  Private
 */
router.get('/', isAuthenticated, getAllNotes);

/**
 * @route   GET /api/notes/:id
 * @desc    Get a specific note by ID (Authenticated users only)
 * @access  Private
 */
router.get('/:id', isAuthenticated, getNoteById);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note by ID (Authenticated users only)
 * @access  Private
 */
router.put('/:id', isAuthenticated, upload('attachments', 6), updateNoteById);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note by ID (Authenticated users only)
 * @access  Private
 */
router.delete('/:id', isAuthenticated, deleteNoteById);

export default router;
