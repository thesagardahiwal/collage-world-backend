"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const likeController_1 = require("../controllers/likeController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Route to like a post
router.post('/like', authMiddleware_1.isAuthenticated, likeController_1.likePost);
// Route to unlike a post
router.post('/unlike', authMiddleware_1.isAuthenticated, likeController_1.unlikePost);
exports.default = router;
