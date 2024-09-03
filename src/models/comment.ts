import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IComment extends Document {
  post: Schema.Types.ObjectId; // The post the comment belongs to
  user: IUser['_id']; // The user who made the comment
  content: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;