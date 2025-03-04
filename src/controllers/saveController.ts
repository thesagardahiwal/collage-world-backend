import { Request, Response } from 'express';
import Resource, { IResource } from '../models/resource';
import Save from '../models/save';
import Post from '../models/post';
import { sendResponse } from '../utils/helper';


// Create a new resource
export const createResource = async (req: Request, res: Response) => {
  try {
    const { title, subject, examType, resourceType, pdfUrl } = req.body;
    const user = req.user?._id;
    if (!user) {
      return sendResponse(res, false, 401, 'User not found');
    }
    const newResource = new Resource({ title, subject, examType, resourceType, pdfUrl, author: user });
    await newResource.save();
    await newResource.populate('author', 'name');
    return sendResponse(res, true, 201, 'Resource created successfully', newResource);
  } catch (err: any) {
    return sendResponse(res, false, 500, 'Server error', err.message);
  }
};

// Get resources
export const getResources = async (req: Request, res: Response) => {
  try {
    const { subject, examType } = req.query;
    const query: any = {};
    if (subject) query.subject = subject;
    if (examType) query.examType = examType;
    const resources = await Resource.find(query).populate('author', 'name');
    if (resources.length === 0) {
      return sendResponse(res, false, 404, 'No resources found');
    }
    return sendResponse(res, true, 200, 'Resources retrieved successfully', resources);
  } catch (err: any) {
    return sendResponse(res, false, 500, 'Server error', err.message);
  }
};

// Remove a resource
export const removeResources = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user?._id;
    if (!user) {
      return sendResponse(res, false, 401, 'User not found');
    }
    const resource = await Resource.findById(id);
    if (!resource) {
      return sendResponse(res, false, 404, 'Resource not found');
    }
    if (resource.author.toString() !== user) {
      return sendResponse(res, false, 403, 'You are not the author of this resource');
    }
    await resource.deleteOne();
    return sendResponse(res, true, 200, 'Resource deleted successfully');
  } catch (err: any) {
    return sendResponse(res, false, 500, 'Server error', err.message);
  }
};

// Get stream-specific resources
export const getStreamResources = async (req: Request, res: Response) => {
  try {
    const { stream } = req.params;
    const query = stream ? { stream } : {};
    const resources = await Resource.find(query).populate('author', 'name');
    if (resources.length === 0) {
      return sendResponse(res, false, 404, 'No resources found for this stream');
    }
    return sendResponse(res, true, 200, 'Stream resources retrieved successfully', resources);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Save a post
export const savePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, 'User not found');
    }

    const post = await Post.findById(postId);
    if (!post) {
      return sendResponse(res, false, 404, 'Post not found');
    }

    const existingSave = await Save.findOne({ post: postId, user: userId });
    if (existingSave) {
      return sendResponse(res, false, 400, 'You have already saved this post');
    }

    const save = new Save({ post: postId, user: userId });
    await save.save();

    return sendResponse(res, true, 201, 'Post saved successfully', save);
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};

// Unsave a post
export const unsavePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return sendResponse(res, false, 401, 'Unauthorized access');
    }

    const save = await Save.findOneAndDelete({ post: postId, user: userId });
    if (!save) {
      return sendResponse(res, false, 404, 'You haven\'t saved this post yet');
    }

    return sendResponse(res, true, 200, 'Post unsaved successfully');
  } catch (error: any) {
    return sendResponse(res, false, 500, 'Server error', error.message);
  }
};