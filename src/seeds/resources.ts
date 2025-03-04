import mongoose from 'mongoose';
import Resource from '../models/resource';
import Like from '../models/like';
import Review from '../models/review';
import Comment from '../models/comment';
import User from '../models/user';
import {faker} from "@faker-js/faker";
import { savePost } from 'src/controllers/saveController';

const pdfUrls = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.orimi.com/pdf-test.pdf",
    "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
    "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
    "https://www.clickdimensions.com/links/TestPDFfile.pdf",
    "https://www.hq.nasa.gov/alsj/a17/A17_FlightPlan.pdf",
    "https://www.africau.edu/images/default/sample.pdf",
    "https://filesamples.com/samples/document/pdf/sample3.pdf",
    "https://www.gutenberg.org/files/1342/1342-h/1342-h.pdf", // Pride and Prejudice
    "https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf",
  ];
  

const seedResources = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/collage-world');
    // Clear existing data
    const users = await User.find();
    await Resource.deleteMany({});
    for (let i = 1; i <= 10; i++) {
      // Create a resource
      const resource = new Resource({
        title: `Resource ${i}`,
        subject: `Subject ${i}`,
        examType: `ExamType ${i}`,
        resourceType: `ResourceType ${i}`,
        stream: `Stream ${i}`,
        pdfUrl: pdfUrls[faker.number.int({min: 0, max: pdfUrls.length - 1})],
        likes: [],
        review: [],
        comment: [],
        author: users[faker.number.int({min: 0, max: users.length - 1})],
      });

      // Create 20 likes for the resource

        for (let j = 0; j < 20; j++) {
            const like = new Like({
                targetType: 'Resource',
                targetId: resource._id,
                user: users[faker.number.int({min: 0, max: users.length - 1})],
            });
            await like.save();
            resource.likes.push(like._id as mongoose.Schema.Types.ObjectId);
        };

      // Create 5 reviews for the resource
      for (let j = 0; j < 5; j++) {
        const review = new Review({
          targetType: 'Resource',
          targetId: resource._id,
          user: users[faker.number.int({min: 0, max: users.length - 1})],
          rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
        });
        await review.save();
        resource.review.push(review._id as mongoose.Schema.Types.ObjectId);
      }

      // Create 3 comments for the resource
      for (let j = 0; j < 3; j++) {
        const comment = new Comment({
          targetType: 'Resource',
          targetId: resource._id,
          user: users[faker.number.int({min: 0, max: users.length - 1})],
          content: `This is comment ${j + 1} on resource ${i}`,
        });
        await comment.save();
        resource.comment.push(comment._id as mongoose.Schema.Types.ObjectId);
      }

      await resource.save();
    }

    console.log('Seed data successfully added.');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

seedResources();
