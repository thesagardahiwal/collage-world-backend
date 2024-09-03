import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';  // Import Cloudinary setup
import Post from '../models/post';

// Create a new post with images
export const uploadPostImages = async (req: Request, res: Response) => {
  try {
    const { images } = req.files as { images: Express.Multer.File[] };

    if (images.length > 6) {
      return res.status(400).json({ message: 'You can upload up to 6 images only.' });
    }

    const imageUrls = [];
    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.path, { folder: 'posts' });
      imageUrls.push(result.secure_url);
    }

    const post = new Post({ title: req.body.title, content: req.body.content, images: imageUrls });
    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a post by ID
export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

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
    const { title, content } = req.body;
    const updates: { title?: string; content?: string; images?: string[] } = {};

    if (title) updates.title = title;
    if (content) updates.content = content;

    // Handle image updates
    if (req.files && req.files['images']) {
      const { images } = req.files as { images: Express.Multer.File[] };

      if (images.length > 6) {
        return res.status(400).json({ message: 'You can upload up to 6 images only.' });
      }

      const imageUrls = [];
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path, { folder: 'posts' });
        imageUrls.push(result.secure_url);
      }
      updates.images = imageUrls;
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