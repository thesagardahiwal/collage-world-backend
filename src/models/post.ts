import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';
import Comment from './comment';  // Import Comment model
import Like from './like'; 
import Save from './save'; 

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

// Middleware to cascade delete post-related data
PostSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const postId = this._id;

    // Delete related comments
    await Comment.deleteMany({ postId });

    // Delete related likes
    await Like.deleteMany({ postId });

    // Delete related saves
    await Save.deleteMany({ postId });

    next();
  } catch (error) {
    next(error);
  }
});

export default Post;