import { Request, Response } from 'express';
import TipTrick from '../models/tipTrick';
import cloudinary from '../config/claudinary';
import { sendResponse } from '../utils/helper';

// Upload a new tip or trick
export const createTipTrick = async (req: Request, res: Response) => {
  try {
    let imageUrls: string[] = [];
    if (req.files) {
      const images = req.files as Express.Multer.File[];
      const uploadPromises = images.map(file => cloudinary.uploader.upload(file.path, { folder: 'tips_tricks' }).then(result => result.secure_url));
      imageUrls = await Promise.all(uploadPromises);
    }
    const tipTrick = new TipTrick({ title: req.body.title, description: req.body.description, topic: req.body.topic, imageUrls });
    await tipTrick.save();
    return sendResponse(res, true, 201, 'Tip or trick created successfully', tipTrick);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Get all tips and tricks
export const getAllTipsTricks = async (req: Request, res: Response) => {
  try {
    const tipsTricks = await TipTrick.find();
    return sendResponse(res, true, 200, 'Tips and tricks retrieved successfully', tipsTricks);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Get a tip or trick by ID
export const getTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return sendResponse(res, false, 404, 'Tip or trick not found');
    }
    return sendResponse(res, true, 200, 'Tip or trick retrieved successfully', tipTrick);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Update a tip or trick by ID
export const updateTipTrickById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.topic) updates.topic = req.body.topic;

    if (req.files) {
      const images = req.files as Express.Multer.File[];
      const uploadPromises = images.map(file => cloudinary.uploader.upload(file.path, { folder: 'tips_tricks' }).then(result => result.secure_url));
      updates.imageUrls = await Promise.all(uploadPromises);
    }

    const tipTrick = await TipTrick.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!tipTrick) {
      return sendResponse(res, false, 404, 'Tip or trick not found');
    }
    return sendResponse(res, true, 200, 'Tip or trick updated successfully', tipTrick);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Delete a tip or trick by ID
export const deleteTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return sendResponse(res, false, 404, 'Tip or trick not found');
    }

    const deletePromises = tipTrick.imageUrls?.map(image => {
      const publicId = image.split('/').pop()?.split('.').shift();
      return publicId ? cloudinary.uploader.destroy(`tips_tricks/${publicId}`) : Promise.resolve();
    }) ?? [];
    await Promise.all(deletePromises);
    await tipTrick.deleteOne();
    return sendResponse(res, true, 200, 'Tip or trick deleted successfully');
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Admin: Get all tips and tricks
export const adminGetAllTipsTricks = async (req: Request, res: Response) => {
  try {
    const tipsTricks = await TipTrick.find();
    return sendResponse(res, true, 200, 'Admin: Tips and tricks retrieved successfully', tipsTricks);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Admin: Delete a tip or trick by ID
export const adminDeleteTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return sendResponse(res, false, 404, 'Tip or trick not found');
    }

    const deletePromises = tipTrick.imageUrls?.map(image => {
      const publicId = image.split('/').pop()?.split('.').shift();
      return publicId ? cloudinary.uploader.destroy(`tips_tricks/${publicId}`) : Promise.resolve();
    }) ?? [];
    await Promise.all(deletePromises);
    await tipTrick.deleteOne();
    return sendResponse(res, true, 200, 'Admin: Tip or trick deleted successfully');
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};
