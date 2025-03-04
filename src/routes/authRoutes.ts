import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginUser);

/**
 * @route   GET /api/auth/isAuthenticated
 * @desc    Check if user is authenticated
 * @access  Private (Authenticated users)
 */
router.get('/isAuthenticated', isAuthenticated, (req, res) => {
    try {
        console.log("FIRED!");
        return res.status(200).json({ message: "Authenticated!" });
    } catch (e) {
        return res.status(500).json({ message: "Server Problem!" });
    }
});

// Uncomment and configure if GitHub OAuth is needed
// /**
//  * @route   GET /api/auth/github
//  * @desc    Authenticate via GitHub OAuth
//  * @access  Public
//  */
// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// /**
//  * @route   GET /api/auth/github/callback
//  * @desc    GitHub OAuth callback
//  * @access  Public
//  */
// router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
//   console.log(req.user);
// });

export default router;
