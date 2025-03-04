import { Request, Response } from 'express';
import cloudinary from '../config/claudinary';
import News from '../models/news';
import { IUser } from '../models/user';
import { sendResponse } from '../utils/helper';


// Create news
export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const images: string[] = req.fileUrls || [];

    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const news = new News({
      title,
      content,
      createdBy: req.user._id as IUser['_id'],
      images,
    });

    await news.save();
    return sendResponse(res, true, 201, "News created successfully", news);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get all news
export const getAllNews = async (req: Request, res: Response) => {
  try {
    const newsList = await News.find().populate('createdBy', 'name');
    return sendResponse(res, true, 200, "News retrieved successfully", newsList);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get news by ID
export const getNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id).populate('createdBy', 'name');
    if (!news) {
      return sendResponse(res, false, 404, "News not found");
    }
    return sendResponse(res, true, 200, "News retrieved successfully", news);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Update news by ID
export const updateNewsById = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const updates: any = { title, content };

    if (req.fileUrls) {
      updates.images = req.fileUrls;
    }

    const news = await News.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!news) {
      return sendResponse(res, false, 404, "News not found");
    }
    return sendResponse(res, true, 200, "News updated successfully", news);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Delete news by ID
export const deleteNewsById = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return sendResponse(res, false, 404, "News not found");
    }

    if (news.images?.length) {
      for (const imageUrl of news.images) {
        const publicId = imageUrl.split('/').pop()?.split('.').shift();
        if (publicId) {
          await cloudinary.uploader.destroy(`news/${publicId}`);
        }
      }
    }

    await news.deleteOne();
    return sendResponse(res, true, 200, "News deleted successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Admin: Delete any news
export const adminDeleteNews = async (req: Request, res: Response) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return sendResponse(res, false, 404, "News not found");
    }

    if (news.images?.length) {
      for (const imageUrl of news.images) {
        const publicId = imageUrl.split('/').pop()?.split('.').shift();
        if (publicId) {
          await cloudinary.uploader.destroy(`news/${publicId}`);
        }
      }
    }

    await news.deleteOne();
    return sendResponse(res, true, 200, "News deleted successfully by admin");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};
