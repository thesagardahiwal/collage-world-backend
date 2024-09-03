import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  educationField: mongoose.Types.ObjectId;
}

const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  educationField: {
    type: Schema.Types.ObjectId,
    ref: 'EducationField',
    required: true,
  },
});

const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;