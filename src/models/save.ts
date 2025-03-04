import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface ISave extends Document {
  targetType: 'Post' | 'Reel' | 'Comment' | 'Resource' | 'Other';
  user: IUser['_id']; // The user who saved the post
  createdAt: Date;
}

const SaveSchema: Schema = new Schema({
  targetType: {
    type: String,
    enum: ['Post', 'Reel', 'Comment', 'Resource', 'Other'], // Define the possible types
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Save = mongoose.model<ISave>('Save', SaveSchema);

export default Save;