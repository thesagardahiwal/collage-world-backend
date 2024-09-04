import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  resourceType: 'image' | 'pdf' | 'ppt' | 'text';
  fileUrl: string;
  uploadedBy: mongoose.Schema.Types.ObjectId; // Reference to User
  educationField: mongoose.Schema.Types.ObjectId; // Reference to EducationField
  subject: mongoose.Schema.Types.ObjectId; // Reference to Subject
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resourceType: {
    type: String,
    enum: ['image', 'pdf', 'ppt', 'text'],
    required: true,
  },
  fileUrl: { type: String, required: true },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  educationField: {
    type: Schema.Types.ObjectId,
    ref: 'EducationField',
    required: true,
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add pre-save middleware to update the `updatedAt` field
ResourceSchema.pre<IResource>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Resource = mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;