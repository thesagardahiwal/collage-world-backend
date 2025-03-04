import mongoose, { Document, Schema } from 'mongoose';
import Comment from './comment';  // Import Comment model
import Like from './like';
import Save from './save';

export interface IPost extends Document {
  title: string;
  content: string;
  tags: [String];
  images: string[]; // Array of image URLs
  author: mongoose.Schema.Types.ObjectId; // Reference to the user
  private: boolean;
  likes: mongoose.Schema.Types.ObjectId[];
  comment: mongoose.Schema.Types.ObjectId[];
  saved: mongoose.Schema.Types.ObjectId[];
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  images: [{ type: String }], // Array of image URLs
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  private: { type: Boolean, default: false },
  likes: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Like', // Reference to the Like model
    },
  ],
  comment: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment"
    }
  ],
  saved: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Save"
    }
  ]
}, { timestamps: true });


const Post = mongoose.model<IPost>('Post', PostSchema);

// Middleware to cascade delete post-related data
PostSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const postId = this._id;

    // Delete related comments
    await Comment.deleteMany({ targetId: postId });

    // Delete related likes
    await Like.deleteMany({ targetId: postId });

    // Delete related saves
    await Save.deleteMany({ targetType: postId });

    next();
  } catch (error: any) {
    next(error);
  }
});

export default Post;