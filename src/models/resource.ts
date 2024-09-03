import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  subject: string;
  examType: string;
  resourceType: string;
  content: string;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true },
  resourceType: { type: String, required: true },
  content: { type: String, required: true },
});

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;