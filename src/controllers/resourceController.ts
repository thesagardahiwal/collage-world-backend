import { Request, Response } from 'express';
import Resource, { IResource } from '../models/resource';

export const createResource = async (req: Request, res: Response)=> {
  const { title, subject, examType, resourceType, content } = req.body;
  try {
    const user = req.user?._id;
    if(!user) {
      return res.status(404).json({message: "User is not fount!"});
    }
    const newResource = new Resource({ title, subject, examType, resourceType, content, author: user });
    await newResource.save();
    const modifiedResource = newResource.populate('author', 'name');
    res.status(201).json(modifiedResource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getResources = async (req: Request, res: Response) => {
  const { subject, examType } = req.query;
  try {
    if (!subject && !examType) {
      const resources = await Resource.find().populate('author', 'name');
      if (!resources) {
        return res.status(400).json({ message: "No resources!" });
      }
      return res.status(200).json({ resources })
    }
    const resources = await Resource.find({ subject, examType });
    return res.status(200).json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeResources = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = req.user?._id;
    if(!user) {
      return res.status(401).json({message: "User is not found!"});
    }
    const resource = await Resource.findOne({_id: id});
    if(!resource) {
      return res.status(400).json({message: "Not Fount!"});
    }

    if (resource.author.toString() != user) {
      return res.status(400).json({message: "You are not author of this resource."});
    }
    await Resource.deleteOne({_id: resource._id});
    res.status(200).json("DELETD!")
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}