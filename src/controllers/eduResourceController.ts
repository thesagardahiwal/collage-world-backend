import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Resource from '../models/eduResource';

// Upload a new resource
export const uploadResource = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    if (!req.user) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."});
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'resources',
      resource_type: req.file.mimetype.includes('image') ? 'image' : 'raw', // Handle different file types
    });

    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      fileUrl: result.secure_url,
      resourceType: req.file.mimetype.includes('image') ? 'image' : 'raw',
      uploadedBy: req.user._id, // Assuming `req.user` contains the authenticated user's info
      educationField: req.body.educationField,
      subject: req.body.subject,
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
    const resource = await Resource.findById(req.params.id)
      .populate('educationField')
      .populate('subject');

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
        resource_type: req.file.mimetype.includes('image') ? 'image' : 'raw',
      });
      updates.fileUrl = result.secure_url;
    }
    
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.educationField) updates.educationField = req.body.educationField;
    if (req.body.subject) updates.subject = req.body.subject;

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

// Admin: Get all resources
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find()
      .populate('educationField')
      .populate('subject');
      
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete any resource
export const adminDeleteResource = async (req: Request, res: Response) => {
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

    res.status(200).json({ message: 'Resource deleted successfully by admin.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};