import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IFollow extends Document {
  follower: IUser['_id']; // The user who is following
  following: IUser['_id']; // The user being followed
  createdAt: Date;
}

const FollowSchema: Schema = new Schema({
  follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Follow = mongoose.model<IFollow>('Follow', FollowSchema);

export default Follow;