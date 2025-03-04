import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Answer from '../models/answer';
import Doubt from '../models/doubt';
import { getLocationOfFile } from '../utils/helperClaudinary';
import { sendResponse } from '../utils/helper';



// Post a new answer
export const postAnswer = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return sendResponse(res, false, 401, 'Unauthorized access. Please provide valid authentication credentials.');
    }

    const images = req.fileUrls;
    const answer = new Answer({
      doubt: req.body.doubt,
      answerer: req.user._id,
      content: req.body.content,
      images,
    });

    const savedAnswer = await answer.save();
    await Doubt.findByIdAndUpdate(req.body.doubt, { $push: { answers: savedAnswer._id } });

    return sendResponse(res, true, 201, 'Answer posted successfully.', savedAnswer);
  } catch (error) {
    return sendResponse(res, false, 500, 'Server error', error);
  }
};

// Get all answers for a specific doubt
export const getAnswersByDoubtId = async (req: Request, res: Response) => {
  try {
    const answers = await Answer.find({ doubt: req.params.doubtId }).populate('answerer');
    return sendResponse(res, true, 200, 'Answers fetched successfully.', answers);
  } catch (error) {
    return sendResponse(res, false, 500, 'Server error', error);
  }
};

// Update an answer by ID
export const updateAnswerById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};
    if (req.fileUrls) updates.images = req.fileUrls;
    if (req.body.content) updates.content = req.body.content;

    const answer = await Answer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!answer) {
      return sendResponse(res, false, 404, 'Answer not found.');
    }

    return sendResponse(res, true, 200, 'Answer updated successfully.', answer);
  } catch (error) {
    return sendResponse(res, false, 500, 'Server error', error);
  }
};

// Delete an answer by ID
export const deleteAnswerById = async (req: Request, res: Response) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return sendResponse(res, false, 404, 'Answer not found.');
    }

    await Promise.all(
      answer.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.').shift();
        if (publicId) {
          return cloudinary.uploader.destroy(`answers/${publicId}`);
        }
      })
    );

    await answer.deleteOne();
    await Doubt.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });

    return sendResponse(res, true, 200, 'Answer deleted successfully.');
  } catch (error) {
    return sendResponse(res, false, 500, 'Server error', error);
  }
};

// Admin: Delete an answer by ID
export const adminDeleteAnswerById = async (req: Request, res: Response) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return sendResponse(res, false, 404, 'Answer not found.');
    }

    await Promise.all(
      answer.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.').shift();
        if (publicId) {
          return cloudinary.uploader.destroy(getLocationOfFile(publicId));
        }
      })
    );

    await answer.deleteOne();
    await Doubt.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });

    return sendResponse(res, true, 200, 'Answer deleted successfully by admin.');
  } catch (error) {
    return sendResponse(res, false, 500, 'Server error', error);
  }
};

// Vote on an answer
export const voteQuestion = async (req: Request, res: Response) => {
  try {
    const { vote } = req.body;
    const answer = await Answer.findByIdAndUpdate(
      req.params.id,
      { $inc: { votes: vote } },
      { new: true }
    );

    if (!answer) {
      return sendResponse(res, false, 404, 'Answer not found.');
    }

    return sendResponse(res, true, 200, 'Vote recorded successfully.', answer);
  } catch (error: any) {
    return sendResponse(res, false, 400, error.message);
  }
};