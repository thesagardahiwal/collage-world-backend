import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Doubt from '../models/doubt';
import { getLocationOfFile } from '../utils/helperClaudinary';

// Create a new doubt
export const createDoubt = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const images = req.fileUrls || [];

    const doubt = new Doubt({
      title: req.body.title,
      description: req.body.description,
      asker: req.user._id,
      images,
    });

    await doubt.save();
    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all doubts
export const getAllDoubts = async (req: Request, res: Response) => {
  try {
    const doubts = await Doubt.find().populate('asker').populate('answers');
    res.status(200).json(doubts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a doubt by ID
export const getDoubtById = async (req: Request, res: Response) => {
  try {
    const doubt = await Doubt.findById(req.params.id).populate('asker').populate('answers');
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found.' });
    }
    res.status(200).json(doubt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a doubt by ID
export const deleteDoubtById = async (req: Request, res: Response) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: 'Doubt not found.' });
    }

    // Delete associated images from Cloudinary
    await Promise.all(
      doubt.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.').shift();
        if (publicId) {
          return cloudinary.uploader.destroy(`doubts/${publicId}`);
        }
        return Promise.resolve(null);
      })
    );

    await doubt.deleteOne();
    res.status(200).json({ message: 'Doubt deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete a doubt by ID
export const adminDeleteDoubtById = async (req: Request, res: Response) => {
    try {
      const doubt = await Doubt.findById(req.params.id);
      if (!doubt) {
        return res.status(404).json({ message: 'Doubt not found.' });
      }
  
      // Delete associated images from Cloudinary
      await Promise.all(
        doubt.images.map((image) => {
          const publicId = image.split('/').pop()?.split('.').shift();
          if (publicId) {
            return cloudinary.uploader.destroy(getLocationOfFile(publicId));
          };
          return Promise.resolve(null);
        })
      );
  
      await doubt.deleteOne();
      res.status(200).json({ message: 'Doubt deleted successfully by admin.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };