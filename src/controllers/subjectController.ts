import { Request, Response } from 'express';
import Subject from '../models/subject';

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { name, educationField } = req.body;
    const subject = new Subject({ name, educationField });
    await subject.save();
    res.status(201).json(subject);
  } catch (error : any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const subjects = await Subject.find().populate('educationField');
    res.status(200).json(subjects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('educationField');
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    res.status(200).json(subject);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};