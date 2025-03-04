"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const answerController_1 = require("../controllers/answerController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authMiddleware_2 = require("../middlewares/authMiddleware"); // Import the admin middleware
const router = express_1.default.Router();
// Post a new answer
router.post('/', authMiddleware_1.isAuthenticated, (0, claudinary_1.uploadFilesToCloudinary)('images', 6), answerController_1.postAnswer);
// Get all answers for a specific doubt
router.get('/doubt/:doubtId', answerController_1.getAnswersByDoubtId);
// Update an answer by ID
router.put('/:id', authMiddleware_1.isAuthenticated, (0, claudinary_1.uploadFilesToCloudinary)('images', 6), answerController_1.updateAnswerById);
// Delete an answer by ID (Admin only)
router.delete('/:id', authMiddleware_1.isAuthenticated, authMiddleware_2.isAdmin, answerController_1.adminDeleteAnswerById);
exports.default = router;
