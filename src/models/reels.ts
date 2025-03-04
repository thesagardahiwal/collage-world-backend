import mongoose, { Document, Schema } from 'mongoose';
import Comment from './comment'; // Import Comment model
import Like from './like';       // Import Like model

export interface IReel extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user who created the reel
  videoUrl: string;             // URL of the reel video
  thumbnailUrl?: string;        // Optional thumbnail for the reel
  description: string;          // Caption or description for the reel
  hashtags: string[];           // Array of hashtags used in the reel
  music?: string;               // Music or audio associated with the reel
  likes: mongoose.Types.ObjectId[]; // List of users who liked the reel
  comments: mongoose.Types.ObjectId[]; // List of comments on the reel
  views: number;                // Number of views for the reel
  shares: number;               // Number of times the reel was shared
  isPublic: boolean;            // Visibility setting for the reel
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}

const ReelSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 500, // Limit description to 500 characters
    },
    hashtags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    music: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Like', // Reference to the Like model
      },
    ],
    comments: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Comment', // Reference to the Comment model
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Middleware for cleaning up associated data when deleting a reel
ReelSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const reelId = this._id;

    // Delete related comments
    await Comment.deleteMany({ targetId: reelId });

    // Delete related likes
    await Like.deleteMany({ targetId: reelId });

    next();
  } catch (error: any) {
    next(error);
  }
});

const Reel = mongoose.model<IReel>('Reel', ReelSchema);

export default Reel;
