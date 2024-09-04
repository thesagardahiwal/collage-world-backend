import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface INews extends Document {
  title: string;
  content: string;
  createdBy: IUser['_id'];
  images?: string[]; // Array of image URLs
  createdAt: Date;
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }], // Array to store image URLs
  createdAt: { type: Date, default: Date.now },
});

const News = mongoose.model<INews>('News', NewsSchema);
export default News;