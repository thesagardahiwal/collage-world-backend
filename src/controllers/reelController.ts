import { Request, Response } from 'express';
import Reel from '../models/reels';
import { sendResponse } from '../utils/helper';

// Get all reels
export const getAllReels = async (req: Request, res: Response) => {
  try {
    const reels = await Reel.find().populate('user');
    if (reels.length > 0) {
      return sendResponse(res, true, 200, 'Reels retrieved successfully', reels);
    }
    return sendResponse(res, false, 404, 'No reels found');
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Something went wrong', error.message);
  }
};