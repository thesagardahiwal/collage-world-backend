import mongoose, { Mongoose } from 'mongoose';
import { config } from 'dotenv';
import Doubt from '../models/doubt';
import Answer from '../models/answer';
import User from '../models/user';
import Resource from '../models/resource';
import { faker } from '@faker-js/faker';

config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/collage-world");

    console.log('Database connected');
    await Doubt.deleteMany({});
    const users = await User.find();

    // Create Doubts with Answers
    for (let i = 1; i <= 20; i++) {
      const asker = users[faker.number.int({min: 0, max: users.length - 1})]._id;

      const doubt = await Doubt.create({
        title: `Sample Doubt Title ${i}`,
        description: `This is a detailed description of doubt ${i}. It explains the problem in depth.`,
        tags: ['javascript', 'react', 'mongodb'],
        asker,
        images: [
          `https://dummyimage.com/600x400/000/fff&text=Doubt+${i}`,
          `https://dummyimage.com/600x400/000/fff&text=Example+Image`,
        ],
        views: Math.floor(Math.random() * 100),
      });

      const answers: any[] = [];

      for (let j = 1; j <= 3; j++) {
        const answerer = users[Math.floor(Math.random() * users.length)]._id;

        const answer = await Answer.create({
          doubt: doubt._id,
          answerer,
          content: `This is answer ${j} for doubt ${i}. It provides a solution or explanation.`,
          images: [
            `https://dummyimage.com/600x400/000/fff&text=Answer+${j}`,
            `https://dummyimage.com/600x400/000/fff&text=Solution+Image`,
          ],
        });

        answers.push(answer._id);
      }

      doubt.answers = answers;
      await doubt.save();

      console.log(`Doubt ${i} with answers created`);
    }

    console.log('Seeding complete');
    console.log('Sample resources added successfully.');

    console.log('Seeding complete');

    // Disconnect from MongoDB
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
