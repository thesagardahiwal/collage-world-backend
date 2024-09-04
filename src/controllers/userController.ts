import { Request, Response } from 'express';
import { uploadFilesToCloudinary as upload } from "../config/claudinary"
import User from '../models/user';
import mlService from '../services/mlService';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const uploadStudentId = [upload('studentId', 1), async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
  
    // Check if file is present
    if (!req.fileUrls) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mlService.verifyStudentId(req.fileUrls[0]);
    const isStudent = result.isStudent;
    await User.findByIdAndUpdate(userId, { isStudent, studentId: req.fileUrls[0] });
    res.json({ isStudent });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
}];