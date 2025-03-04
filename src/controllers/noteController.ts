import { Request, Response } from 'express';
import cloudinary from '../config/claudinary';
import Note from '../models/note';
import { getLocationOfFile } from '../utils/helperClaudinary';
import { sendResponse } from '../utils/helper';

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const createdBy = req.user?._id;
    if (!createdBy) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
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
      attachments: { imageUrls, documentUrls },
      createdBy,
    });

    await note.save();
    return sendResponse(res, true, 201, "Note created successfully", note);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get all notes
export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const user = req.user?._id;
    if (!user) {
      return sendResponse(res, false, 401, "User is not valid!");
    }
    const notes = await Note.find({ createdBy: user });
    return sendResponse(res, true, 200, "Notes retrieved successfully", notes);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get a note by ID
export const getNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return sendResponse(res, false, 404, "Note not found");
    }
    return sendResponse(res, true, 200, "Note retrieved successfully", note);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Update a note by ID
export const updateNoteById = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const updates: any = { title, content };

    if (req.fileUrls) {
      updates.attachments = { imageUrls: [], documentUrls: [] };
      for (const file of req.fileUrls) {
        if (file.includes("jpg") || file.includes("jpeg")) {
          updates.attachments.imageUrls.push(file);
        } else {
          updates.attachments.documentUrls.push(file);
        }
      }
    }

    const note = await Note.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!note) {
      return sendResponse(res, false, 404, "Note not found");
    }
    return sendResponse(res, true, 200, "Note updated successfully", note);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Delete a note by ID
export const deleteNoteById = async (req: Request, res: Response) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return sendResponse(res, false, 404, "Note not found");
    }

    const deleteImagePromises = note.attachments?.imageUrls?.map(image => {
      const publicId = image.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
      return Promise.resolve();
    }) ?? [];

    const deleteDocumentPromises = note.attachments?.documentUrls?.map(doc => {
      const publicId = doc.split('/').pop()?.split('.').shift();
      if (publicId) {
        return cloudinary.uploader.destroy(getLocationOfFile(publicId));
      }
      return Promise.resolve();
    }) ?? [];

    await Promise.all([...deleteImagePromises, ...deleteDocumentPromises]);
    await note.deleteOne();
    return sendResponse(res, true, 200, "Note deleted successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};