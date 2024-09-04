import mongoose, { Document, Schema } from 'mongoose';
import EventRegistration from './eventRegistration';
import EventFeedback from './eventFeedback';
import EventSchedule from './eventSchedule';
import Post from './post';
import Resource from './resource';

export interface IEvent extends Document {
  name: string;
  description: string;
  date: Date;
  location: string;
  organizer: mongoose.Types.ObjectId; // Reference to User
  participants: mongoose.Types.ObjectId[]; // References to User
  resources: mongoose.Types.ObjectId[]; // References to Resource
  posts: mongoose.Types.ObjectId[]; // References to Post
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  resources: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

const Event = mongoose.model<IEvent>('Event', EventSchema);

EventSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    const eventId = this._id;

    await EventRegistration.deleteMany({ event: eventId });
    await EventFeedback.deleteMany({ event: eventId });
    await EventSchedule.deleteMany({ event: eventId });
    await Post.deleteMany({ _id: { $in: this.posts } });
    await Resource.deleteMany({ _id: { $in: this.resources } });

    next();
});

export default Event;