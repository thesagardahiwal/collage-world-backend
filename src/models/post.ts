import mongoose, { Document, Schema } from 'mongoose';
import Comment from './comment';  // Import Comment model
import Like from './like'; 
import Save from './save'; 

export interface IPost extends Document {
  title: string;
  content: string;
  images: string[]; // Array of image URLs
  author: mongoose.Schema.Types.ObjectId; // Reference to the user
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });


const Post = mongoose.model<IPost>('Post', PostSchema);

// Middleware to cascade delete post-related data
PostSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const postId = this._id;

    // Delete related comments
    await Comment.deleteMany({ post: postId });

    // Delete related likes
    await Like.deleteMany({ post: postId });

    // Delete related saves
    await Save.deleteMany({ post: postId });

    next();
  } catch (error : any) {
    next(error);
  }
});

export default Post;