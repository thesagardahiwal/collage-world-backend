import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';
import Comment from './comment';  // Import Comment model
import Like from './like'; 
import Save from './save'; 

export interface IPost extends Document {
  title: string;
  content: string;
  images: string[];  // Array of image URLs
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }],  // Array to store image URLs
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