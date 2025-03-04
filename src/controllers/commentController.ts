import { Request, Response } from 'express';
import Comment from '../models/comment';
import Post from '../models/post';
import mongoose from 'mongoose';
import { sendResponse } from '../utils/helper';


// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }

    const comment = new Comment({ post: postId, user: userId, content });
    await comment.save();

    return sendResponse(res, true, 201, "Comment added successfully", comment);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", (error as Error).message);
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId, content } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { content },
      { new: true }
    );

    if (!comment) {
      return sendResponse(res, false, 404, "Comment not found or you're not authorized");
    }

    return sendResponse(res, true, 200, "Comment updated successfully", comment);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", (error as Error).message);
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });

    if (!comment) {
      return sendResponse(res, false, 404, "Comment not found or you're not authorized");
    }

    return sendResponse(res, true, 200, "Comment deleted successfully");
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", (error as Error).message);
  }
};

// Get a comment by ID
export const getCommentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(new mongoose.Types.ObjectId(id));

    if (!comment) {
      return sendResponse(res, false, 404, "Comment not found");
    }

    return sendResponse(res, true, 200, "Comment retrieved successfully", comment);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", (error as Error).message);
  }
};