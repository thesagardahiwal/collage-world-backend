import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Answer from '../models/answer';
import Doubt from '../models/doubt';
import { getLocationOfFile } from '../utils/helperClaudinary';

// Post a new answer
export const postAnswer = async (req: Request, res: Response) => {
  try {

    if (!req.user) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    const images = req.fileUrls;

    const answer = new Answer({
      doubt: req.body.doubt,
      answerer: req.user._id,
      content: req.body.content,
      images,
    });

    const savedAnswer = await answer.save();

    // Add the answer to the doubt's answers array
    await Doubt.findByIdAndUpdate(req.body.doubt, { $push: { answers: savedAnswer._id } });

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all answers for a specific doubt
export const getAnswersByDoubtId = async (req: Request, res: Response) => {
  try {
    const answers = await Answer.find({ doubt: req.params.doubtId }).populate('answerer');
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update an answer by ID
export const updateAnswerById = async (req: Request, res: Response) => {
  try {
    const updates: any = {};

    if (req.fileUrls) {
      updates.images = req.fileUrls;
    }

    if (req.body.content) updates.content = req.body.content;

    const answer = await Answer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }

    res.status(200).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete an answer by ID
export const deleteAnswerById = async (req: Request, res: Response) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found.' });
    }

    // Delete associated images from Cloudinary
    await Promise.all(
      answer.images.map((image) => {
        const publicId = image.split('/').pop()?.split('.').shift();
        if (publicId) {
          return cloudinary.uploader.destroy(`answers/${publicId}`);
        }
      })
    );

    await answer.deleteOne();

    // Remove the answer from the doubt's answers array
    await Doubt.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });

    res.status(200).json({ message: 'Answer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Admin: Delete an answer by ID
export const adminDeleteAnswerById = async (req: Request, res: Response) => {
    try {
      const answer = await Answer.findById(req.params.id);
      if (!answer) {
        return res.status(404).json({ message: 'Answer not found.' });
      }
  
      // Delete associated images from Cloudinary
      await Promise.all(
        answer.images.map((image) => {
          const publicId = image.split('/').pop()?.split('.').shift();
          if (publicId) {
            return cloudinary.uploader.destroy(getLocationOfFile(publicId));
          }
        })
      );
  
      await answer.deleteOne();
  
      // Remove the answer from the doubt's answers array
      await Doubt.findByIdAndUpdate(answer.doubt, { $pull: { answers: answer._id } });
  
      res.status(200).json({ message: 'Answer deleted successfully by admin.' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };