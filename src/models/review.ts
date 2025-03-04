import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';

export interface IReview extends Document {
  targetType: 'Post' | 'Reel' | 'Comment' | 'Resource' | 'Other'; // The type of entity that is liked
  targetId: Schema.Types.ObjectId;                 // The ID of the associated entity (post, reel, comment, etc.)
  user: IUser['_id'];                              // The user who liked the entity
  createdAt: Date;                                 // Timestamp when the like was created
}

const ReviewSchema: Schema = new Schema(
  {
    targetType: {
      type: String,
      enum: ['Post', 'Reel', 'Comment', 'Resource', 'Other'], // Define the possible types
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

    rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5]
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Automatically adds createdAt but not updatedAt
  }
);

const Review = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
