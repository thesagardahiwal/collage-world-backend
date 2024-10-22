import express from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import { createNote, getAllNotes, getNoteById, updateNoteById, deleteNoteById } from '../controllers/noteController';
import { isAuthenticated } from '../middlewares/authMiddleware'; // Middleware to check if user is authenticated

const router = express.Router();

// Create a new note
router.post('/notes', isAuthenticated, upload('attachments', 6), createNote);

// Get all notes
router.get('/notes',isAuthenticated,  getAllNotes);

// Get a note by ID
router.get('/notes/:id',isAuthenticated,  getNoteById);

// Update a note by ID
router.post('/notes/:id', isAuthenticated, upload('attachments', 6), updateNoteById);

// Delete a note by ID
router.delete('/notes/:id', isAuthenticated, deleteNoteById);

export default router;