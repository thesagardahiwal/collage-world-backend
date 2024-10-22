import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { isAuthenticated } from '../middlewares/authMiddleware';
// import passport from '../config/passport';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/isAuthenticated', isAuthenticated, ((req, res) => {
    try {
        console.log("FIRED!")
        return res.send(200).json({message: "Authenticated!"});
    } catch(e) {
        return res.status(500).json({message: "Server Problem!"});
    }
}))
// GitHub OAuth routes
// router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// router.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
// //   const { token , user  } = req.user;
//   console.log(req.user);
// });

export default router;