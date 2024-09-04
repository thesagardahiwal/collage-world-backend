import { Request, Response } from 'express';
import Comment from '../models/comment';
import Post from '../models/post';

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  try {
    const { postId, content } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(500).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = new Comment({
      post: postId,
      user: userId,
      content,
    });

    await comment.save();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
  try {
    const { commentId, content } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(500).json({message: "User not found!"})
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { content },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or you're not authorized" });
    }

    res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(500).json({message: "User not found!"})
    }

    const comment = await Comment.findOneAndDelete({ _id: commentId, user: userId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found or you're not authorized" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};