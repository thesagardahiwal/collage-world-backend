import { timeStamp } from 'console';
import mongoose, { Document, Schema } from 'mongoose';

export interface IDoubt extends Document {
  title: string;
  description: string;
  tags: [String];
  asker: Schema.Types.ObjectId; // Reference to User
  images: string[]; // URLs of images uploaded to Cloudinary
  createdAt: Date;
  updatedAt: Date;
  views: number, // Track views
  votes: mongoose.Types.ObjectId[],
  answers: Schema.Types.ObjectId[]; // References to answers
}

const DoubtSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  asker: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }], // Array of image URLs
  tags: [String],
  views: { type: Number, default: 0 }, // Track views
  votes: [{
    type: mongoose.Types.ObjectId,
    ref: 'Like', // Reference to the Like model
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
});

const Doubt = mongoose.model<IDoubt>('Doubt', DoubtSchema);

export default Doubt;