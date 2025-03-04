import mongoose from 'mongoose';
import User, { IUser } from '../models/user'; // Adjust path as necessary
import Post, { IPost } from '../models/post'; // Adjust path as necessary
import Comment, { IComment } from '../models/comment'; // Adjust path as necessary
import Like from '../models/like'; // Adjust path as necessary
import { faker } from '@faker-js/faker';

const seedPosts = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/collage-world'); // Replace with your database connection string

    // Fetch all users
    const users = await User.find<IUser>().lean(); // Use .lean() to simplify _id handling

    if (!users.length) {
      console.error('No users found. Add some users first.');
      process.exit(1);
    }

    const imageUrls = [
      "https://images.unsplash.com/photo-1542744095-291d1f67b221",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
      "https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      "https://images.unsplash.com/photo-1501769214405-6c0836abf376",
      "https://images.unsplash.com/photo-1488826701980-7c1a5f9a1af5",
      "https://images.unsplash.com/photo-1542224566-6e1f24c6b7c5",
      "https://images.unsplash.com/photo-1547721064-da6cfb341d50",
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308",
      "https://images.unsplash.com/photo-1514820720301-4c479edb8510",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      "https://images.unsplash.com/photo-1495490140452-5a226aef25d2",
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
      "https://images.unsplash.com/photo-1488751045188-3c55bbf9a3fa",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      "https://images.unsplash.com/photo-1463453091185-61582044d556",
      "https://images.unsplash.com/photo-1472417583565-62e7bdeda490",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28c7",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    ];
    

    // Clear existing post, comment, and like data
    await Post.deleteMany();

    const posts: IPost[] = [];
    const comments: IComment[] = [];
    const likes: { targetType: string; targetId: mongoose.Types.ObjectId; user: mongoose.Types.ObjectId }[] = [];

    users.forEach((user) => {
      const userId = new mongoose.Types.ObjectId(user._id as any);

      // Create 5 posts per user
      for (let i = 0; i < 5; i++) {
        const post = new Post({
          title: `Post Title ${i + 1} by ${user.username}`,
          content: `This is the content of post ${i + 1} by ${user.username}.`,
          tags: [`tag${i + 1}`, `tag${i + 2}`],
          images: [imageUrls[faker.number.int({min: 0, max: 3})],
          imageUrls[faker.number.int({min: 4, max: 6})],
          imageUrls[faker.number.int({min: 10, max: 12})],
          imageUrls[faker.number.int({min: 13, max: imageUrls.length - 1})],
          imageUrls[faker.number.int({min: 7, max: 9})]], // Replace with actual image URLs
          author: userId,
          private: false, // Randomly set some posts as private
        });
        posts.push(post);

        // Create 3 comments per post
        for (let j = 0; j < 3; j++) {
          const comment = new Comment({
            targetType: 'Post',
            targetId: post._id as mongoose.Types.ObjectId,
            user: userId,
            content: `This is comment ${j + 1} on post ${i + 1} by ${user.username}.`,
          });
          post.comment.push(comment._id as any); // Link comments to the post
        }

        // Add 1 to 25 likes per post
        const likeCount = Math.floor(Math.random() * 25) + 1;
        const shuffledUsers = users.sort(() => 0.5 - Math.random()); // Randomize users
        shuffledUsers.slice(0, likeCount).forEach((liker) => {
          const like = {
            targetType: 'Post',
            targetId: post._id,
            user: new mongoose.Types.ObjectId(liker._id as any),
          };
          likes.push(like as any);
          post.likes.push(like.user as any); // Link likes to the post
        });
      }
    });

    // Insert posts, comments, and likes into the database
    await Post.insertMany(posts);
    await Comment.insertMany(comments);
    await Like.insertMany(likes);

    console.log(`${posts.length} posts, ${comments.length} comments, and ${likes.length} likes created.`);

    // Close the database connection
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
};

seedPosts();
