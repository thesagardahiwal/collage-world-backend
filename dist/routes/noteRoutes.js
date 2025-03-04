"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const noteController_1 = require("../controllers/noteController");
const authMiddleware_1 = require("../middlewares/authMiddleware"); // Middleware to check if user is authenticated
const router = express_1.default.Router();
// Create a new note
router.post('/notes', authMiddleware_1.isAuthenticated, (0, claudinary_1.uploadFilesToCloudinary)('attachments', 6), noteController_1.createNote);
// Get all notes
router.get('/notes', authMiddleware_1.isAuthenticated, noteController_1.getAllNotes);
// Get a note by ID
router.get('/notes/:id', authMiddleware_1.isAuthenticated, noteController_1.getNoteById);
// Update a note by ID
router.post('/notes/:id', authMiddleware_1.isAuthenticated, (0, claudinary_1.uploadFilesToCloudinary)('attachments', 6), noteController_1.updateNoteById);
// Delete a note by ID
router.delete('/notes/:id', authMiddleware_1.isAuthenticated, noteController_1.deleteNoteById);
exports.default = router;
