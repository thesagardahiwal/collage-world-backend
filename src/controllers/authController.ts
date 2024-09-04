import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import bcrypt from 'bcryptjs';
import generateToken from '../config/auth';

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser : IUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    const newUser_id : any = newUser._id
    const token = generateToken(newUser_id.toString());
    res.status(201).json({ token });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user : any = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user._id.toString());
    res.json({ token });
  } catch (err : any) {
    res.status(500).json({ error: err.message });
  }
};