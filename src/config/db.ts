import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const MONGODB_URL : any = process.env.MONGODB_URL
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected');
  } catch (err : any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;