import mongoose, { Document, Schema } from 'mongoose';

export interface ITipTrick extends Document {
  title: string;
  description: string;
  topic: string;
  imageUrls?: string[];
}

const TipTrickSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  topic: { type: String, required: true },
  imageUrls: [{ type: String }]
});

const TipTrick = mongoose.model<ITipTrick>('TipTrick', TipTrickSchema);

export default TipTrick;