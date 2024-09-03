import { Request, Response } from 'express';
import Education from '../models/education';

export const createEducation = async (req: Request, res: Response) => {
  try {
    const { name, subjects } = req.body;
    const education = new Education({ name, subjects });
    await education.save();
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.find().populate('subjects');
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEducationById = async (req: Request, res: Response) => {
  try {
    const education = await Education.findById(req.params.id).populate('subjects');
    if (!education) return res.status(404).json({ message: 'Education not found' });
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};