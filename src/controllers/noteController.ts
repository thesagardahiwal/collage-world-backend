import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Note from '../models/note';

// Helper functions for uploading files to Cloudinary
const uploadFile = async (file: Express.Multer.File, folder: string) => {
  const result = await cloudinary.uploader.upload(file.path, { folder });
  return result.secure_url;
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const createdBy = req.user?._id; // Assuming `req.user` contains authenticated user information

    if (!createdBy) {
      return res.status(401).json({message : "Unauthorized access. Please provide valid authentication credentials."})
    }

    let imageUrls: string[] = [];
    let documentUrls: string[] = [];

    if (req.files) {
      const files = req.files as Express.Multer.File[];

      // Separate files into images and documents
      const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
      const documentFiles = files.filter(file => !file.mimetype.startsWith('image/'));

      // Upload images and documents
      imageUrls = await Promise.all(imageFiles.map(file => uploadFile(file, 'notes/images')));
      documentUrls = await Promise.all(documentFiles.map(file => uploadFile(file, 'notes/documents')));
    }

    const note = new Note({
      title,
      content,
      attachments: {
        imageUrls,
        documentUrls,
      },
      createdBy,
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all notes
export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await Note.find().populate('createdBy');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id).populate('createdBy');
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a note by ID
export const updateNoteById = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const updates: any = { title, content };

    if (req.files) {
      const files = req.files as Express.Multer.File[];
      let imageUrls: string[] = [];
      let documentUrls: string[] = [];

      // Separate files into images and documents
      const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
      const documentFiles = files.filter(file => !file.mimetype.startsWith('image/'));

      // Upload images and documents
      imageUrls = await Promise.all(imageFiles.map(file => uploadFile(file, 'notes/images')));
      documentUrls = await Promise.all(documentFiles.map(file => uploadFile(file, 'notes/documents')));

      updates.attachments = {
        imageUrls,
        documentUrls,
      };
    }

    const note = await Note.findByIdAndUpdate(req.params.id, updates, { new: true }).populate('createdBy');
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }
    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a note by ID
export const deleteNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found.' });
    }

    // Delete associated images and documents from Cloudinary
    const deleteImagePromises = note.attachments?.imageUrls?.map(image => {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(`notes/images/${publicId}`);
      }
      return Promise.resolve(); // Handle cases where publicId is undefined
    }).filter(promise => promise !== undefined) as Promise<any>[];

    const deleteDocumentPromises = note.attachments?.documentUrls?.map(doc => {
      const publicId = doc.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(`notes/documents/${publicId}`);
      }
      return Promise.resolve(); // Handle cases where publicId is undefined
    }).filter(promise => promise !== undefined) as Promise<any>[];

    await Promise.all([...deleteImagePromises, ...deleteDocumentPromises]);

    await note.deleteOne();
    res.status(200).json({ message: 'Note deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};