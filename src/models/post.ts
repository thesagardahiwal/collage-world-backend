import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IPost extends Document {
  user: IUser['_id']; // The user who created the post
  content: string; // The content of the post
  createdAt: Date;
}

const PostSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<IPost>('Post', PostSchema);

export default Post;