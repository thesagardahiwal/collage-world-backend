import express from 'express';
import { createNote, getAllNotes, getNoteById, updateNoteById, deleteNoteById } from '../controllers/noteController';
import { isAuthenticated } from '../middlewares/authMiddleware'; // Middleware to check if user is authenticated

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Create a new note
router.post('/notes', isAuthenticated, upload.array('attachments'), createNote);

// Get all notes
router.get('/notes', getAllNotes);

// Get a note by ID
router.get('/notes/:id', getNoteById);

// Update a note by ID
router.put('/notes/:id', isAuthenticated, upload.array('attachments'), updateNoteById);

// Delete a note by ID
router.delete('/notes/:id', isAuthenticated, deleteNoteById);

export default router;