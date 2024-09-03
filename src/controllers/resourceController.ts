import { Request, Response } from 'express';
import Resource, { IResource } from '../models/resource';

export const createResource = async (req: Request, res: Response): Promise<void> => {
  const { title, subject, examType, resourceType, content } = req.body;
  try {
    const newResource: IResource = new Resource({ title, subject, examType, resourceType, content });
    await newResource.save();
    res.status(201).json(newResource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getResources = async (req: Request, res: Response): Promise<void> => {
  const { subject, examType } = req.query;
  try {
    const resources: IResource[] = await Resource.find({ subject, examType });
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};