"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Route to create a new comment
router.post('/comment', authMiddleware_1.isAuthenticated, commentController_1.createComment);
// Route to update an existing comment
router.put('/comment', authMiddleware_1.isAuthenticated, commentController_1.updateComment);
// Route to delete a comment
router.delete('/comment', authMiddleware_1.isAuthenticated, commentController_1.deleteComment);
exports.default = router;
