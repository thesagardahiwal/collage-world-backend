import mongoose, { Document, Schema } from 'mongoose';

export interface IEventFeedback extends Document {
  event: mongoose.Types.ObjectId; // Reference to Event
  participant: mongoose.Types.ObjectId; // Reference to User
  rating: number; // Rating out of 5
  comment: string;
}

const EventFeedbackSchema: Schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  participant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: false },
});

const EventFeedback = mongoose.model<IEventFeedback>('EventFeedback', EventFeedbackSchema);

export default EventFeedback;