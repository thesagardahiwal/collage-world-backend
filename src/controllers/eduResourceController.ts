import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';  // Import Cloudinary setup
import Resource from '../models/eduResource';

// Upload a new resource
export const uploadResource = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resources',
      resource_type: req.file.mimetype.includes('image') ? 'image' : 'raw' // Handle different file types
    });

    const resource = new Resource({
      title: req.body.title,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
    });

    await resource.save();

    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a resource by ID
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a resource by ID
export const updateResourceById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'resources',
        resource_type: req.file.mimetype.includes('image') ? 'image' : 'raw'
      });
      updates.fileUrl = result.secure_url;
    }
    
    if (req.body.title) updates.title = req.body.title;

    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a resource by ID
export const deleteResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    // Delete associated file from Cloudinary
    const publicId = resource.fileUrl.split('/').pop()?.split('.').shift(); // Extract public ID from URL
    if (publicId) {
      await cloudinary.uploader.destroy(`resources/${publicId}`);
    }

    await resource.deleteOne();

    res.status(200).json({ message: 'Resource deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};