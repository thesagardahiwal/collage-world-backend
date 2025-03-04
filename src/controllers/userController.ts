import { Request, Response } from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary";
import User from '../models/user';
import mlService from '../services/mlService';
import { sendResponse } from '../utils/helper';


declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const uploadStudentId = [
  upload('studentId', 1),
  async (req: Request, res: Response) => {
    try {
      if (!req.userId) {
        return sendResponse(res, false, 400, 'User ID is missing');
      }
      if (!req.fileUrls) {
        return sendResponse(res, false, 400, 'No file uploaded');
      }

      const result = await mlService.verifyStudentId(req.fileUrls[0]);
      const isStudent = result.isStudent;
      await User.findByIdAndUpdate(req.userId, { isStudent, studentId: req.fileUrls[0] });
      return sendResponse(res, true, 200, 'Student ID uploaded successfully', { isStudent });
    } catch (error: any) {
      return sendResponse(res, false, 500, 'Server error', error.message);
    }
  }
];

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const userDetails = await User.findOne({ username });
    if (!userDetails) {
      return sendResponse(res, false, 404, 'User not found');
    }
    return sendResponse(res, true, 200, 'User details retrieved successfully', userDetails);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().limit(20);
    return sendResponse(res, true, 200, 'Users retrieved successfully', users);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};