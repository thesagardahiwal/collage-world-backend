// import passport from 'passport';
// import GitHubStrategy from 'passport-github2';
// import jwt from 'jsonwebtoken';
// import User, { IUser } from '../models/user'; // Adjust the path as necessary

// interface PassportCallbackParams {
//     accessToken: string;
//     refreshToken: string;
//     profile: {
//       id: string;
//       displayName: string;
//       emails: { value: string }[];
//       _json: {
//         avatar_url: string;
//       };
//     };
//     done: (err: any, user?: { token: string; user: any } | any) => void;
//   }

// // Define GitHubStrategy callback function
// passport.use(new GitHubStrategy.Strategy({
//   clientID: process.env.GITHUB_CLIENT_ID!,
//   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//   callbackURL: '/auth/github/callback',
// }, async (accessToken: string, refreshToken: string, profile: PassportCallbackParams['profile'], done: PassportCallbackParams['done']) => {
//   try {
//     const existingUser = await User.findOne({ email: profile.emails });
//     if (existingUser) {
//       // Generate JWT
//       const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
//       return done(null, { token, user: existingUser });
//     }

//     const newUser = new User({
//       name: profile.displayName,
//       email: profile.emails[0].value,
//       avatar: profile._json.avatar_url,
//       role: "student",
//     });

//     await newUser.save();
//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
//     return done(null, { token, user : newUser});
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// passport.serializeUser((user: any, done: (err: any, user: any) => void) => {
//   done(null, user);
// });

// passport.deserializeUser((user: any, done: (err: any, user: any) => void) => {
//   done(null, user);
// });

// export default passport;