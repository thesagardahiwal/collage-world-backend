import { Request, Response } from 'express';
import cloudinary from '../config/claudinary';
import News from '../models/news';
import { IUser } from '../models/user';

// Create news
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const images: string[] = [];

    if (req.files) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'news',
          resource_type: 'image',
        });
        images.push(result.secure_url);
      }
    }

    const news = new News({
      title,
      content,
      createdBy: req.user._id as IUser['_id'], // Assuming user is attached to req
      images,
    });

    await news.save();

    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all news
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const newsList = await News.find().populate('createdBy', 'name');
    res.status(200).json(newsList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get news by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id).populate('createdBy', 'name');

    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update news by ID
export const updateNewsById = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const updates: any = { title, content };

    if (req.files) {
      const images: string[] = [];
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'news',
          resource_type: 'image',
        });
        images.push(result.secure_url);
      }
      updates.images = images;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete news by ID
export const deleteNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    // Delete associated images from Cloudinary
    if (news.images && news.images.length > 0) {
      for (const imageUrl of news.images) {
        const publicId = imageUrl.split('/').pop()?.split('.').shift();
        if (publicId) {
          await cloudinary.uploader.destroy(`news/${publicId}`);
        }
      }
    }

    await news.deleteOne();
    res.status(200).json({ message: 'News deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete any news
export const adminDeleteNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found.' });
    }

    // Delete associated images from Cloudinary
    if (news.images && news.images.length > 0) {
      for (const imageUrl of news.images) {
        const publicId = imageUrl.split('/').pop()?.split('.').shift();
        if (publicId) {
          await cloudinary.uploader.destroy(`news/${publicId}`);
        }
      }
    }

    await news.deleteOne();
    res.status(200).json({ message: 'News deleted successfully by admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};