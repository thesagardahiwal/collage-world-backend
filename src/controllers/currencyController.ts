import { Request, Response } from 'express';
import User from '../models/user';
import { sendResponse } from '../utils/helper';

// Add currency to a user
export const addCurrency = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (amount <= 0) return sendResponse(res, false, 400, 'Invalid amount');

  try {
    const user = await User.findById(userId);
    if (!user) return sendResponse(res, false, 404, 'User not found');

    user.inAppCurrency += amount;
    await user.save();
    return sendResponse(res, true, 200, 'Currency added successfully', { inAppCurrency: user.inAppCurrency });
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Deduct currency from a user
export const deductCurrency = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (amount <= 0) return sendResponse(res, false, 400, 'Invalid amount');

  try {
    const user = await User.findById(userId);
    if (!user) return sendResponse(res, false, 404, 'User not found');

    if (user.inAppCurrency < amount) return sendResponse(res, false, 400, 'Insufficient funds');

    user.inAppCurrency -= amount;
    await user.save();
    return sendResponse(res, true, 200, 'Currency deducted successfully', { inAppCurrency: user.inAppCurrency });
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};
