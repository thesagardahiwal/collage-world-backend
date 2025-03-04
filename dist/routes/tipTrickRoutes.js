"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const tipTrickController_1 = require("../controllers/tipTrickController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authMiddleware_2 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const upload = claudinary_1.uploadFilesToCloudinary; // Adjust as needed
// Create a new tip or trick
router.post('/', authMiddleware_1.isAuthenticated, upload('images', 5), tipTrickController_1.createTipTrick);
// Get all tips and tricks
router.get('/', tipTrickController_1.getAllTipsTricks);
// Get a tip or trick by ID
router.get('/:id', tipTrickController_1.getTipTrickById);
// Update a tip or trick by ID
router.put('/:id', authMiddleware_1.isAuthenticated, upload('images', 5), tipTrickController_1.updateTipTrickById);
// Delete a tip or trick by ID
router.delete("/:id", authMiddleware_1.isAuthenticated, tipTrickController_1.deleteTipTrickById);
// Delete a tip or trick by ID (Admin only)
router.delete('/:id', authMiddleware_1.isAuthenticated, authMiddleware_2.isAdmin, tipTrickController_1.adminDeleteTipTrickById);
// Admin: Get all tips and tricks
router.get('/admin', authMiddleware_1.isAuthenticated, authMiddleware_2.isAdmin, tipTrickController_1.adminGetAllTipsTricks);
exports.default = router;
