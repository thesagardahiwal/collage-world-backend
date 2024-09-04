import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to upload multiple files to Cloudinary
export const uploadFilesToCloudinary = (fieldName: string, maxCount: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: 'Error uploading files.' });
      }

      if (!req.files || req.files.length === 0) {
        return next(); // No files uploaded, proceed to the next middleware
      }

      try {
        const uploadPromises = (req.files as Express.Multer.File[]).map((file) =>
          uploadFile(file)
        );

        const results = await Promise.all(uploadPromises);
        req.fileUrls = results.map((result) => result.secure_url);
        next();
      } catch (error) {
        return res.status(500).json({ message: 'Error processing files.', error });
      }
    });
  };
};

// Upload file to Cloudinary
const uploadFile = (file: Express.Multer.File) => {
  const resourceType = getResourceType(file.mimetype);

  return new Promise<any>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      folder: 'uploads/', // Customize as needed
      resource_type: resourceType,
    }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });

    uploadStream.end(file.buffer);
  });
};

// Determine resource type based on MIME type
const getResourceType = (mimeType: string): 'image' | 'video' | 'raw' => {
  if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('video/')) {
    return 'video';
  } else {
    return 'raw'; // For documents and other file types
  }
};

// Export Cloudinary instance
export default cloudinary;