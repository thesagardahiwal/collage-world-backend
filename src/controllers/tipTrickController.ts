import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import TipTrick from '../models/tipTrick';
import multer from 'multer';

// Upload a new tip or trick
export const createTipTrick = async (req: Request, res: Response) => {
  try {
    let imageUrls: string[] = [];

    if (req.files) {
      const images = req.files as Express.Multer.File[];
      const uploadPromises = images.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'tips_tricks',
          resource_type: 'image'
        }).then((result) => result.secure_url);
      });

      imageUrls = await Promise.all(uploadPromises);
    }

    const tipTrick = new TipTrick({
      title: req.body.title,
      description: req.body.description,
      topic: req.body.topic,
      imageUrls
    });

    await tipTrick.save();
    res.status(201).json(tipTrick);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all tips and tricks
export const getAllTipsTricks = async (req: Request, res: Response) => {
  try {
    const tipsTricks = await TipTrick.find();
    res.status(200).json(tipsTricks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a tip or trick by ID
export const getTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return res.status(404).json({ message: 'Tip or trick not found.' });
    }
    res.status(200).json(tipTrick);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
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
      const uploadPromises = images.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: 'tips_tricks',
          resource_type: 'image'
        }).then((result) => result.secure_url);
      });

      updates.imageUrls = await Promise.all(uploadPromises);
    }

    const tipTrick = await TipTrick.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!tipTrick) {
      return res.status(404).json({ message: 'Tip or trick not found.' });
    }
    res.status(200).json(tipTrick);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a tip or trick by ID
export const deleteTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return res.status(404).json({ message: 'Tip or trick not found.' });
    }

    // Delete associated images from Cloudinary
    const deletePromises = tipTrick.imageUrls?.map((image) => {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(`tips_tricks/${publicId}`);
      }
      return Promise.resolve(); // Handle cases where publicId is undefined
    }).filter(promise => promise !== undefined) as Promise<any>[];

    await Promise.all(deletePromises);

    await tipTrick.deleteOne();
    res.status(200).json({ message: 'Tip or trick deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Get all tips and tricks with their images
export const adminGetAllTipsTricks = async (req: Request, res: Response) => {
  try {
    const tipsTricks = await TipTrick.find();
    res.status(200).json(tipsTricks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete a tip or trick by ID
export const adminDeleteTipTrickById = async (req: Request, res: Response) => {
  try {
    const tipTrick = await TipTrick.findById(req.params.id);
    if (!tipTrick) {
      return res.status(404).json({ message: 'Tip or trick not found.' });
    }

    // Delete associated images from Cloudinary
    const deletePromises = tipTrick.imageUrls?.map((image) => {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(`tips_tricks/${publicId}`);
      }
      return Promise.resolve(); // Handle cases where publicId is undefined
    }).filter(promise => promise !== undefined) as Promise<any>[];

    await Promise.all(deletePromises);

    await tipTrick.deleteOne();
    res.status(200).json({ message: 'Tip or trick deleted successfully by admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};