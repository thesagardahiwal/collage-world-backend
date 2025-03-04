import mongoose from 'mongoose';
import User, { IUser } from '../models/user'; // Adjust path as necessary
import Follow from '../models/follow'; // Adjust path as necessary

const seedFollows = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/collage-world'); // Replace with your database connection string
  
      // Fetch all users
      const users = await User.find<IUser>().lean(); // Use .lean() to simplify _id handling
      if (users.length < 2) {
        console.error('Not enough users to create follow relationships.');
        process.exit(1);
      }
  
      // Clear existing follow data
      await Follow.deleteMany();
  
      const followData: { follower: mongoose.Types.ObjectId; following: mongoose.Types.ObjectId; createdAt: Date }[] = [];
  
      users.forEach((follower) => {
        const followerId = new mongoose.Types.ObjectId(follower._id as any); // Ensure _id is correctly typed
  
        const potentialFollowings = users.filter(
          (user) => user._id.toString() !== followerId.toString()
        );
  
        // Randomize and pick some users to follow
        const followCount = Math.floor(Math.random() * (potentialFollowings.length / 2)) + 1; // Ensures not all users are followed
        const selectedFollowings = potentialFollowings.sort(() => 0.5 - Math.random()).slice(0, followCount);
  
        selectedFollowings.forEach((following) => {
          const followingId = new mongoose.Types.ObjectId(following._id as any); // Ensure _id is correctly typed
          followData.push({
            follower: followerId,
            following: followingId,
            createdAt: new Date(),
          });
        });
      });
  
      // Insert follow data
      await Follow.insertMany(followData);
      console.log(`${followData.length} follow relationships created.`);
  
      // Close the database connection
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error seeding follow data:', error);
      process.exit(1);
    }
  };
  
  seedFollows();
  