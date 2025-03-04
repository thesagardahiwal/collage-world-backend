import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Doubt from '../models/doubt';
import { getLocationOfFile } from '../utils/helperClaudinary';
import { sendResponse } from '../utils/helper';

// Create a new doubt
export const createDoubt = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const images = req.fileUrls || [];

    const doubt = new Doubt({
      title: req.body.title,
      description: req.body.description,
      asker: req.user._id,
      images,
    });

    await doubt.save();
    return sendResponse(res, true, 201, "Doubt created successfully", doubt);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", error);
  }
};

// Get all doubts
export const getAllDoubts = async (req: Request, res: Response) => {
  try {
    const doubts = await Doubt.find().populate('asker').populate('answers');
    return sendResponse(res, true, 200, "Doubts retrieved successfully", doubts);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", error);
  }
};

// Get a doubt by ID
export const getDoubtById = async (req: Request, res: Response) => {
  try {
    const doubt = await Doubt.findById(req.params.id).populate('asker').populate({
      path: "answers",
      populate: {
        path: "answerer"
      }
    });
    if (!doubt) {
      return sendResponse(res, false, 404, "Doubt not found.");
    }
    return sendResponse(res, true, 200, "Doubt retrieved successfully", doubt);
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", error);
  }
};

// Delete a doubt by ID
export const deleteDoubtById = async (req: Request, res: Response) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return sendResponse(res, false, 404, "Doubt not found.");
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
    return sendResponse(res, true, 200, "Doubt deleted successfully.");
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", error);
  }
};

// Admin: Delete a doubt by ID
export const adminDeleteDoubtById = async (req: Request, res: Response) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return sendResponse(res, false, 404, "Doubt not found.");
    }

    // Delete associated images from Cloudinary
    await Promise.all(
      doubt.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.').shift();
        if (publicId) {
          return cloudinary.uploader.destroy(getLocationOfFile(publicId));
        }
        return Promise.resolve(null);
      })
    );

    await doubt.deleteOne();
    return sendResponse(res, true, 200, "Doubt deleted successfully by admin.");
  } catch (error) {
    return sendResponse(res, false, 500, "Server error", error);
  }
};

// Vote on a question
export const voteQuestion = async (req: Request, res: Response) => {
  try {
    const { vote } = req.body; // `vote` should be +1 for upvote, -1 for downvote
    const question = await Doubt.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: vote } },
      { new: true }
    );

    if (!question) {
      return sendResponse(res, false, 404, "Question not found");
    }

    return sendResponse(res, true, 200, "Vote updated successfully", question);
  } catch (error: any) {
    return sendResponse(res, false, 400, "Server error", error.message);
  }
};
