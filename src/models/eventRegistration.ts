import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRegistration extends Document {
  event: mongoose.Types.ObjectId; // Reference to Event
  participant: mongoose.Types.ObjectId; // Reference to User
  registrationDate: Date;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const EventRegistrationSchema: Schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  participant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
});

const EventRegistration = mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);

export default EventRegistration;