"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const claudinary_1 = require("../config/claudinary");
const doubtController_1 = require("../controllers/doubtController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authMiddleware_2 = require("../middlewares/authMiddleware"); // Import the admin middleware
const router = express_1.default.Router();
// Create a new doubt
router.post('/', authMiddleware_1.isAuthenticated, (0, claudinary_1.uploadFilesToCloudinary)('images', 6), doubtController_1.createDoubt);
// Get all doubts
router.get('/', doubtController_1.getAllDoubts);
// Get a doubt by ID
router.get('/:id', doubtController_1.getDoubtById);
// Delete a doubt by ID
router.delete('/:id', authMiddleware_1.isAuthenticated, doubtController_1.deleteDoubtById);
// Delete a doubt by ID (Admin only)
router.delete('/:id', authMiddleware_1.isAuthenticated, authMiddleware_2.isAdmin, doubtController_1.adminDeleteDoubtById);
exports.default = router;
