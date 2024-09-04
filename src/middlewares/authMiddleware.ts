import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if the user is a teacher
export const isTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role = "teacher") {
      return next(); // User is a teacher, proceed to the next middleware
    }

    return res.status(403).json({ message: 'Access denied. Only teachers can perform this action.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.email == "dahiwalsagarkrishna@collageworld.com") {
      return next(); // User is an admin, proceed to the next middleware
    }

    return res.status(403).json({ message: 'Access denied. Only admins can perform this action.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};