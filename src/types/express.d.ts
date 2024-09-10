import { Request } from 'express';
import { IUser } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      fileUrl?: string;
      fileUrls?: string[];
      userId?: string;
      user?: IUser & { _id: string };
      User?:  {
        _id: string;
      }
    }
  }
}

