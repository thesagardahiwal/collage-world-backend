import { Request, Response } from 'express';
import cloudinary from '../config/claudinary'; // Import Cloudinary setup
import Note from '../models/note';
import { getLocationOfFile } from '../utils/helperClaudinary';


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

    if (req.fileUrls?.length) {
      for (let file of req.fileUrls) {
        if (file.includes("jpg") || file.includes("jpeg")) {
          imageUrls.push(file);
        } else {
          documentUrls.push(file);
        }
      }
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

    if (req.fileUrls) {
      const images: string[] = [];
      for (const file of req.fileUrls) {
        images.push(file);
      }
      updates.images = images;
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
        return cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
      return Promise.resolve(); // Handle cases where publicId is undefined
    }).filter(promise => promise !== undefined) as Promise<any>[];

    const deleteDocumentPromises = note.attachments?.documentUrls?.map(doc => {
      const publicId = doc.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(getLocationOfFile(publicId));
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