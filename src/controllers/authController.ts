import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';
import generateToken from '../config/auth';
import { sendResponse } from '../utils/helper';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, username, bio, stream } = req.body;
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return sendResponse(res, false, 409, 'User already exists!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: IUser = new User({ name, email, password: hashedPassword, username, bio, stream });
    await newUser.save();
    const newUser_id : any = newUser._id
    const token = generateToken(newUser_id.toString());
    return sendResponse(res, true, 201, 'User registered successfully.', { token, user: newUser });
  } catch (err: any) {
    return sendResponse(res, false, 500, 'Server error', err.message);
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: any = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendResponse(res, false, 401, 'Invalid credentials');
    }

    const token = generateToken(user._id.toString());
    return sendResponse(res, true, 200, 'Login successful.', { token, user });
  } catch (err: any) {
    return sendResponse(res, false, 500, 'Server error', err.message);
  }
};