import { Request, Response } from 'express';
import cloudinary from '../config/claudinary';  // Import Cloudinary setup
import Post from '../models/post';
import { getLocationOfFile } from '../utils/helperClaudinary';

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const images = req.fileUrls || [];

    const post = new Post({
      title,
      content,
      images,
      author: req.body.author, // Assuming author ID is provided in the request body
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('author');

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
      const images = []
      for (let file of req.fileUrls) {
          images.push( req.fileUrls);
      }
      if (images.length > 0) {
        updates.images = images;
      }
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a post by ID
export const deletePostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Delete associated images from Cloudinary
    for (const image of post.images) {
      const publicId = image.split('/').pop()?.split('.').shift(); // Extract public ID from URL
      if (publicId) {
        await cloudinary.uploader.destroy(`posts/${publicId}`);
      }
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().populate('author');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete any post
export const adminDeletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Delete associated images from Cloudinary
    for (const image of post.images) {
      const publicId = image.split('/').pop()?.split('.').shift(); // Extract public ID from URL
      if (publicId) {
        await cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
    }

    await post.deleteOne();

    res.status(200).json({ message: 'Post deleted successfully by admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};