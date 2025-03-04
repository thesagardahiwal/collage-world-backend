  // Import Like model
import { faker } from '@faker-js/faker';
import mongoose from "mongoose";
import Comment from "../models/comment";
import Like from "../models/like";
import Reel from "../models/reels";
import User, { IUser } from "../models/user";

async function seedDatabase() {
  // Connect to MongoDB
  await mongoose.connect('mongodb://localhost:27017/collage-world');

  // Delete existing data
//   await User.deleteMany({});
  await Reel.deleteMany({});
  await Comment.deleteMany({});
  await Like.deleteMany({});

//   // Generate 10 sample users
//   const userDocs = [];
//   for (let i = 0; i < 30; i++) { // 30 users
//     userDocs.push({
//       username: faker.internet.userName(),
//       name: faker.name.fullName(),
//       bio: faker.lorem.sentence(),
//       email: faker.internet.email(),
//       password: faker.internet.password(),
//       stream: faker.internet.url(),
//       profilePhoto: faker.image.avatar(),
//       inAppCurrency: faker.number.int({ min: 0, max: 1000 }),
//     });
//   }
//   await User.insertMany(userDocs);

//   const savedUsers = await User.insertMany(userDocs);
  // Generate 10 sample reels
  const dummyVideoUrls = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
     'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  ];
  const savedUsers = await User.find();
  const reels = [];
  for (let i = 0; i < 10; i++) {
    const userId = savedUsers[faker.number.int({ min: 0, max: savedUsers.length-1 })]._id;
    reels.push({
      user: userId,
      videoUrl: dummyVideoUrls[faker.number.int({min: 0, max: 9})],
      description: faker.lorem.sentence(),
      hashtags: [faker.lorem.word(), faker.lorem.word()],
      music: faker.lorem.word(),
    });
  }
  const savedReels = await Reel.insertMany(reels);

  // Generate 14 comments and 29 likes for each reel
  for (let reel of savedReels) {
    const comments = [];
    const likes = [];

    for (let j = 0; j < 14; j++) {
      comments.push({
        targetType: 'Reel',
        targetId: reel._id,
        user: savedUsers[faker.number.int({ min: 0, max: 29 })]._id,
        content: faker.lorem.sentence(),
        likes: [],
        replies: [],
      });
    }
    await Comment.insertMany(comments);

    for (let j = 0; j < 29; j++) {
      likes.push({
        targetType: 'Reel',
        targetId: reel._id,
        user: savedUsers[faker.number.int({ min: 0, max: 29 })]._id,
      });
    }
    await Like.insertMany(likes);
  }

  console.log('Database seeded successfully!');
  mongoose.disconnect();
}

seedDatabase();
