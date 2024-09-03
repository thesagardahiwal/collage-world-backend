import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  subject: mongoose.Types.ObjectId;
  fileUrl: string;  // URL of the uploaded file
  fileType: string;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
});

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;