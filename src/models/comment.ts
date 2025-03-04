import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IComment extends Document {
  targetType: 'Post' | 'Reel' | 'Resource'| 'Other'; // The type of entity the comment is associated with
  targetId: Schema.Types.ObjectId;      // The ID of the associated entity (post, reel, etc.)
  user: IUser['_id'];                   // The user who made the comment
  content: string;                      // The content of the comment
  likes: Schema.Types.ObjectId[];       // List of users who liked the comment
  replies: Schema.Types.ObjectId[];     // List of replies to this comment
  createdAt: Date;                      // Timestamp when the comment was created
  updatedAt: Date;                      // Timestamp when the comment was last updated
}

const CommentSchema: Schema = new Schema(
  {
    targetType: {
      type: String,
      enum: ['Post', 'Reel', 'Resource', 'Other'], // Define the possible types
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000, // Limit comment content to 1000 characters
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to users who liked the comment
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment', // Reference to nested comments (replies)
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
