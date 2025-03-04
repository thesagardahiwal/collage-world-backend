import { Request, Response } from 'express';
import Education from '../models/education';
import { sendResponse } from '../utils/helper';


export const createEducation = async (req: Request, res: Response) => {
  try {
    const { name, subjects } = req.body;
    const education = new Education({ name, subjects });
    await education.save();
    return sendResponse(res, true, 201, "Education created successfully", education);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

export const getEducation = async (req: Request, res: Response) => {
  try {
    const education = await Education.find().populate('subjects');
    return sendResponse(res, true, 200, "Education retrieved successfully", education);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

export const getEducationById = async (req: Request, res: Response) => {
  try {
    const education = await Education.findById(req.params.id).populate('subjects');
    if (!education) return sendResponse(res, false, 404, "Education not found");
    return sendResponse(res, true, 200, "Education retrieved successfully", education);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};
