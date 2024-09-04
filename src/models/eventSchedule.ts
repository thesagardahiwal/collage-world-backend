import mongoose, { Document, Schema } from 'mongoose';

export interface IEventSchedule extends Document {
  event: mongoose.Types.ObjectId; // Reference to Event
  title: string;
  startTime: Date;
  endTime: Date;
  description: string;
}

const EventScheduleSchema: Schema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  description: { type: String, required: true },
});

const EventSchedule = mongoose.model<IEventSchedule>('EventSchedule', EventScheduleSchema);

export default EventSchedule;