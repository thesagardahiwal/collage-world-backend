import mongoose, { Document, Schema } from 'mongoose';

import Comment from './comment';  // Import Comment model
import Like from './like';        // Import Like model
import Follow from './follow';    // Import Follow model
import Save from './save'; 

export interface IUser extends Document {
  username: string;
  name: string;
  bio: string;
  email: string;
  password: string;
  stream: string;
  profilePhoto?: string;
  inAppCurrency: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePhoto: { type: String },
  stream: {type: String, required: true},
  inAppCurrency: {
    type: Number,
    default: 0, // Default to 0, can be updated based on actions
  },
});

UserSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const userId = this._id;

    // Delete related comments
    await Comment.deleteMany({ user: userId });

    // Delete related likes
    await Like.deleteMany({ user: userId });

    // Delete related follows
    await Follow.deleteMany({ follower: userId });
    await Follow.deleteMany({ following: userId });

    // Delete related saves
    await Save.deleteMany({ id: userId });

    next();
  } catch (error : any) {
    next(error);
  }
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;