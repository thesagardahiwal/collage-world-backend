import { Request, Response } from 'express';
import User from '../models/user';

// Add currency to a user
export const addCurrency = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.inAppCurrency += amount;
    await user.save();
    res.status(200).json({ message: 'Currency added successfully', inAppCurrency: user.inAppCurrency });
  } catch (error : any) {
    res.status(500).json({ message: error.message });
  }
};

// Deduct currency from a user
export const deductCurrency = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.inAppCurrency < amount) return res.status(400).json({ message: 'Insufficient funds' });

    user.inAppCurrency -= amount;
    await user.save();
    res.status(200).json({ message: 'Currency deducted successfully', inAppCurrency: user.inAppCurrency });
  } catch (error : any) {
    res.status(500).json({ message: error.message });
  }
};