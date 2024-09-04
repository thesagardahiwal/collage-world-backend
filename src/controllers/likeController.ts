import { Request, Response } from 'express';
import Like from '../models/like';
import Post from '../models/post';

// Like a post
export const likePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post" });
    }

    const like = new Like({
      post: postId,
      user: userId,
    });

    await like.save();

    res.status(201).json({ message: "Post liked successfully", like });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unlike a post
export const unlikePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const like = await Like.findOneAndDelete({ post: postId, user: userId });

    if (!like) {
      return res.status(404).json({ message: "You haven't liked this post yet" });
    }

    res.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};