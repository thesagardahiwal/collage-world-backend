import { Request, Response } from 'express';
import Like from '../models/like';
import Post from '../models/post';
import { sendResponse } from '../utils/helper';

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }

    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return sendResponse(res, false, 400, "You have already liked this post");
    }

    const like = new Like({ post: postId, user: userId });
    await like.save();

    return sendResponse(res, true, 201, "Post liked successfully", like);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const like = await Like.findOneAndDelete({ post: postId, user: userId });
    if (!like) {
      return sendResponse(res, false, 404, "You haven't liked this post yet");
    }

    return sendResponse(res, true, 200, "Post unliked successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};
