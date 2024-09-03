import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGODB_URL : string = process.env.MONGODB_URL || "mongodb://localhost:27017/collage-world"
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected');
  } catch (err : any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;