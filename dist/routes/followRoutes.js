"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const followController_1 = require("../controllers/followController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/followers/:id', authMiddleware_1.isAuthenticated, followController_1.getFollowers);
router.get('/following/:id', authMiddleware_1.isAuthenticated, followController_1.getFollowing);
// Route to follow a user
router.post('/follow', authMiddleware_1.isAuthenticated, followController_1.followUser);
// Route to unfollow a user
router.post('/unfollow', authMiddleware_1.isAuthenticated, followController_1.unfollowUser);
exports.default = router;
