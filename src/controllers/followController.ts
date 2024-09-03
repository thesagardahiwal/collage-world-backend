import { Request, Response } from 'express';
import Follow from '../models/follow';

// Follow a user
export const followUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // The user to follow
    const followerId = req.user._id; // The user who is following

    if (userId === followerId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: userId });
    if (existingFollow) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    const follow = new Follow({
      follower: followerId,
      following: userId,
    });

    await follow.save();

    res.status(201).json({ message: "User followed successfully", follow });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Unfollow a user
export const unfollowUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // The user to unfollow
    const followerId = req.user._id; // The user who is unfollowing

    const follow = await Follow.findOneAndDelete({ follower: followerId, following: userId });

    if (!follow) {
      return res.status(404).json({ message: "You are not following this user" });
    }

    res.status(200).json({ message: "User unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};