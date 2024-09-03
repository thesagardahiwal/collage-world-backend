import { Request, Response } from 'express';
import User from '../models/user';
import multer from 'multer';
import mlService from '../services/mlService';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

export const uploadStudentId = [upload.single('studentId'), async (req: Request, res: Response) => {
  const userId = req.userId;
  try {
    const result = await mlService.verifyStudentId(req.file.path);
    const isStudent = result.isStudent;
    await User.findByIdAndUpdate(userId, { isStudent, studentId: req.file.path });
    res.json({ isStudent });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
}];