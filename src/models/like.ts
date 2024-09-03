import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface ILike extends Document {
  post: Schema.Types.ObjectId; // The post that is liked
  user: IUser['_id']; // The user who liked the post
  createdAt: Date;
}

const LikeSchema: Schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Like = mongoose.model<ILike>('Like', LikeSchema);

export default Like;