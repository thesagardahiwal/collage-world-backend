import { Request, Response } from 'express';
import Save from '../models/save';
import Post from '../models/post';

// Save a post
export const savePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(500).json({message: "User not found!"})
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingSave = await Save.findOne({ post: postId, user: userId });
    if (existingSave) {
      return res.status(400).json({ message: "You have already saved this post" });
    }

    const save = new Save({
      post: postId,
      user: userId,
    });

    await save.save();

    res.status(201).json({ message: "Post saved successfully", save });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unsave a post
export const unsavePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if(!userId) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const save = await Save.findOneAndDelete({ post: postId, user: userId });

    if (!save) {
      return res.status(404).json({ message: "You haven't saved this post yet" });
    }

    res.status(200).json({ message: "Post unsaved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};