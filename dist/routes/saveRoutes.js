"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saveController_1 = require("../controllers/saveController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Route to save a post
router.post('/save', authMiddleware_1.isAuthenticated, saveController_1.savePost);
// Route to unsave a post
router.post('/unsave', authMiddleware_1.isAuthenticated, saveController_1.unsavePost);
exports.default = router;
