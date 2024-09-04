import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import { createNote, getAllNotes, getNoteById, updateNoteById, deleteNoteById } from '../controllers/noteController';
import { isAuthenticated } from '../middlewares/authMiddleware'; // Middleware to check if user is authenticated

const router = express.Router();

// Create a new note
router.post('/notes', isAuthenticated, upload('attachments', 6), createNote);

// Get all notes
router.get('/notes', getAllNotes);

// Get a note by ID
router.get('/notes/:id', getNoteById);

// Update a note by ID
router.put('/notes/:id', isAuthenticated, upload('attachments', 6), updateNoteById);

// Delete a note by ID
router.delete('/notes/:id', isAuthenticated, deleteNoteById);

export default router;