import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isStudent: boolean;
  studentId?: string;
  educationField?: mongoose.Types.ObjectId; // Reference to the EducationField model
  inAppCurrency: number;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isStudent: { type: Boolean, default: false },
  studentId: { type: String },
  educationField: {
    type: Schema.Types.ObjectId,
    ref: 'EducationField',
  },
  inAppCurrency: {
    type: Number,
    default: 0, // Default to 0, can be updated based on actions
  },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;