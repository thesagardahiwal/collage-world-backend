import { Request, Response } from 'express';

export const sendResponse = (res: Response, success: boolean, status: number, message: string, data: any = null) => {
    return res.status(status).json({ success, status, message, data });
  };