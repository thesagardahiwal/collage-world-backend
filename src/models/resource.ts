import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  subject: string;
  examType: string;
  resourceType: string;
  stream: string;
  pdfUrl: string;
  likes: mongoose.Schema.Types.ObjectId[];
  review: mongoose.Schema.Types.ObjectId[]; // Add this explicitly
  comment: mongoose.Schema.Types.ObjectId[];
  author: mongoose.Schema.Types.ObjectId;
}

const ResourceSchema: Schema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  examType: { type: String, required: true },
  resourceType: { type: String, required: true },
  stream: { type : String, required: true},
  pdfUrl: { type: String, required: true },
  likes: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Like', // Reference to the Like model
        },
      ],
  
  review: [
        {
          type: mongoose.Types.ObjectId,
          ref: 'Review', // Reference to the Review model
        },
      ],
    
      comment: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Comment"
        }
      ],
  
  author: {type: Schema.Types.ObjectId, ref: 'User', required: true}
});

const Resource = mongoose.model<IResource>('Resource', ResourceSchema);

export default Resource;