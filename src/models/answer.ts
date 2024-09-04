import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  doubt: Schema.Types.ObjectId; // Reference to Doubt
  answerer: Schema.Types.ObjectId; // Reference to User
  content: string;
  images: string[]; // URLs of images uploaded to Cloudinary
  createdAt: Date;
  updatedAt: Date;
}

const AnswerSchema: Schema = new Schema({
  doubt: { type: Schema.Types.ObjectId, ref: 'Doubt', required: true },
  answerer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Answer = mongoose.model<IAnswer>('Answer', AnswerSchema);

export default Answer;