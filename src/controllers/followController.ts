import { Request, Response } from 'express';
import Follow from '../models/follow';
import User from '../models/user';
import { sendResponse } from '../utils/helper';


// Follow a user
export const followUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const followerId = req.user?._id;

    if (!followerId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    if (userId === followerId.toString()) {
      return sendResponse(res, false, 400, "You cannot follow yourself");
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: userId });
    if (existingFollow) {
      return sendResponse(res, false, 400, "You are already following this user");
    }

    const follow = new Follow({
      follower: followerId,
      following: userId,
    });

    await follow.save();
    return sendResponse(res, true, 201, "User followed successfully", follow);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const followerId = req.user?._id;

    if (!followerId) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const follow = await Follow.findOneAndDelete({ follower: followerId, following: userId });
    if (!follow) {
      return sendResponse(res, false, 404, "You are not following this user");
    }

    return sendResponse(res, true, 200, "User unfollowed successfully");
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get followers
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const user = await User.findById(id);
    if (!user) {
      return sendResponse(res, false, 404, "No User");
    }

    const followers = await Follow.find({ following: user._id }).populate("follower").populate("following");
    if (!followers) {
      return sendResponse(res, false, 404, "No Followers");
    }

    return sendResponse(res, true, 200, "Followers retrieved successfully", followers);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};

// Get following
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return sendResponse(res, false, 401, "Unauthorized access. Please provide valid authentication credentials.");
    }

    const user = await User.findById(id);
    if (!user) {
      return sendResponse(res, false, 404, "No User");
    }

    const following = await Follow.find({ follower: user._id });
    if (!following) {
      return sendResponse(res, false, 404, "No following");
    }

    return sendResponse(res, true, 200, "Following retrieved successfully", following);
  } catch (error: any) {
    return sendResponse(res, false, 500, "Server error", error.message);
  }
};
