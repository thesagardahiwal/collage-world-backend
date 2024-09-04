import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      fileUrl?: string;
      fileUrls?: string[];
      userId?: string;
      user?: {
        _id: string ; // Adjust type if necessary
        [key: string ]: any; // To accommodate other user properties
      };
    }
  }
}

