import mongoose, { Document, Schema } from 'mongoose';

import Comment from './comment';  // Import Comment model
import Like from './like';        // Import Like model
import Follow from './follow';    // Import Follow model
import Save from './save'; 

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isStudent: boolean;
  studentId?: string;
  educationField?: mongoose.Types.ObjectId; // Reference to the EducationField model
  inAppCurrency: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  studentId: { type: String },
  educationField: {
    type: Schema.Types.ObjectId,
    ref: 'EducationField',
  },
  inAppCurrency: {
    type: Number,
    default: 0, // Default to 0, can be updated based on actions
  },
  role: { type: String, enum: ['student', 'teacher'], required: true },
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