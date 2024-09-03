import { Request, Response } from 'express';
import Resource from '../models/eduResource';

export const createResource = async (req: Request, res: Response) => {
  try {
    const { title, description, subject, link } = req.body;
    const resource = new Resource({ title, description, subject, link });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResources = async (req: Request, res: Response) => {
  try {
    const resources = await Resource.find().populate('subject');
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResourceById = async (req: Request, res: Response) => {
  try {
    const resource = await Resource.findById(req.params.id).populate('subject');
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};