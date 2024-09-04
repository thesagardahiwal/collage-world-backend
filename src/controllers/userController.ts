import { Request, Response } from 'express';
import User from '../models/user';
import multer from 'multer';
import mlService from '../services/mlService';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const uploadStudentId = [upload.single('studentId'), async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }
  
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await mlService.verifyStudentId(req.file.path);
    const isStudent = result.isStudent;
    await User.findByIdAndUpdate(userId, { isStudent, studentId: req.file.path });
    res.json({ isStudent });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
}];