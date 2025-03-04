import { Request, Response } from 'express';
import { getLocationOfFile, getResourceTypeFromUrl } from "../utils/helperClaudinary";
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Resource from '../models/eduResource';
import { sendResponse } from '../utils/helper';

// Upload a new resource
export const uploadResource = async (req: Request, res: Response) => {
  try {
    if (!req.fileUrls?.length) {
      return sendResponse(res, false, 400, "No file uploaded.");
    }

    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const resource = new Resource({
      title: req.body.title,
      description: req.body.description,
      fileUrl: req.fileUrls[0],
      resourceType: getResourceTypeFromUrl(req.fileUrls[0]),
      uploadedBy: req.user._id,
      educationField: req.body.educationField,
      subject: req.body.subject,
    });

    await resource.save();
    return sendResponse(res, true, 201, "Resource uploaded successfully", resource);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get a resource by ID
export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('educationField')
      .populate('subject');

    if (!resource) {
      return sendResponse(res, false, 404, "Resource not found.");
    }

    return sendResponse(res, true, 200, "Resource retrieved successfully", resource);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Update a resource by ID
export const updateResourceById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.educationField) updates.educationField = req.body.educationField;
    if (req.body.subject) updates.subject = req.body.subject;

    const resource = await Resource.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!resource) {
      return sendResponse(res, false, 404, "Resource not found.");
    }

    return sendResponse(res, true, 200, "Resource updated successfully", resource);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Delete a resource by ID
export const deleteResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return sendResponse(res, false, 404, "Resource not found.");
    }

    // Delete associated file from Cloudinary
    const publicId = resource.fileUrl.split('/').pop()?.split('.').shift();
    if (publicId) {
      await cloudinary.uploader.destroy(getLocationOfFile(publicId));
    }

    await resource.deleteOne();
    return sendResponse(res, true, 200, "Resource deleted successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Admin: Get all resources
export const getAllResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find()
      .populate('educationField')
      .populate('subject');
    return sendResponse(res, true, 200, "All resources retrieved successfully", resources);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Admin: Delete any resource
export const adminDeleteResource = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return sendResponse(res, false, 404, "Resource not found.");
    }

    // Delete associated file from Cloudinary
    const publicId = resource.fileUrl.split('/').pop()?.split('.').shift();
    if (publicId) {
      await cloudinary.uploader.destroy(`resources/${publicId}`);
    }

    await resource.deleteOne();
    return sendResponse(res, true, 200, "Resource deleted successfully by admin.");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};