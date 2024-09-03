import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface ISave extends Document {
  post: Schema.Types.ObjectId; // The post that is saved
  user: IUser['_id']; // The user who saved the post
  createdAt: Date;
}

const SaveSchema: Schema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Save = mongoose.model<ISave>('Save', SaveSchema);

export default Save;