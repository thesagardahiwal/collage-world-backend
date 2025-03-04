"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
// import passport from '../config/passport';
const router = (0, express_1.Router)();
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.loginUser);
router.get('/isAuthenticated', authMiddleware_1.isAuthenticated, ((req, res) => {
    try {
        console.log("FIRED!");
        return res.send(200).json({ message: "Authenticated!" });
    }
    catch (e) {
        return res.status(500).json({ message: "Server Problem!" });
    }
}));
// GitHub OAuth routes
// router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
// router.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
// //   const { token , user  } = req.user;
//   console.log(req.user);
// });
exports.default = router;
