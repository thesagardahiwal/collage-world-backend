import express from 'express';
import multer from 'multer';
import { createTipTrick, getAllTipsTricks, getTipTrickById, updateTipTrickById, deleteTipTrickById, adminGetAllTipsTricks, adminDeleteTipTrickById } from '../controllers/tipTrickController';
import { isAuthenticated } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Adjust as needed

// Create a new tip or trick
router.post('/', isAuthenticated, upload.array('images', 5), createTipTrick);

// Get all tips and tricks
router.get('/', getAllTipsTricks);

// Get a tip or trick by ID
router.get('/:id', getTipTrickById);

// Update a tip or trick by ID
router.put('/:id', isAuthenticated, upload.array('images', 5), updateTipTrickById);

// Delete a tip or trick by ID
router.delete("/:id", isAuthenticated, deleteTipTrickById);

// Delete a tip or trick by ID (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, adminDeleteTipTrickById);

// Admin: Get all tips and tricks
router.get('/admin', isAuthenticated, isAdmin, adminGetAllTipsTricks);

export default router;