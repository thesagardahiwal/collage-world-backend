import { Request, Response } from 'express';
import cloudinary from '../config/claudinary';
import Post from '../models/post';
import { getLocationOfFile } from '../utils/helperClaudinary';
import User from '../models/user';
import { sendResponse } from '../utils/helper';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, author } = req.body;
    const images = req.fileUrls || [];

    const post = new Post({ title, content, images, author });
    await post.save();

    return sendResponse(res, true, 201, "Post created successfully", post);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get a post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author').populate({
      path: 'comment',
      populate: { path: 'user', model: 'User' },
    });

    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }
    return sendResponse(res, true, 200, "Post retrieved successfully", post);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get posts by user ID
export const getPostByUserId = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return sendResponse(res, false, 404, "No user found");
    }

    const posts = await Post.find({ author: user._id });
    return sendResponse(res, true, 200, "Posts retrieved successfully", posts);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Update a post by ID
export const updatePostById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    const { title, content } = req.body;

    if (title) updates.title = title;
    if (content) updates.content = content;
    if (req.fileUrls?.length) {
      updates.images = req.fileUrls;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }
    return sendResponse(res, true, 200, "Post updated successfully", post);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Delete a post by ID
export const deletePostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }

    for (const image of post.images) {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        await cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
    }

    await post.deleteOne();
    return sendResponse(res, true, 200, "Post deleted successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get all posts (Admin)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('author');
    return sendResponse(res, true, 200, "All posts retrieved successfully", posts);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Admin: Delete any post
export const adminDeletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return sendResponse(res, false, 404, "Post not found");
    }

    for (const image of post.images) {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        await cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
    }

    await post.deleteOne();
    return sendResponse(res, true, 200, "Post deleted successfully by admin");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};