import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
// import passport from '../config/passport';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
// GitHub OAuth routes
// router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// router.get('/auth/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
// //   const { token , user  } = req.user;
//   console.log(req.user);
// });

export default router;