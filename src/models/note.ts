import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  attachments?: {
    imageUrls?: string[];
    documentUrls?: string[];
  };
  createdBy: mongoose.Types.ObjectId; // Reference to the user who created the note
}

const NoteSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  attachments: {
    imageUrls: [{ type: String }],
    documentUrls: [{ type: String }],
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;