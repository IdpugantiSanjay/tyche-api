import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  description: { type: String },
  username: { type: String, required: true },
  category: { type: String, required: true },
  createdDate: { type: Date, default: new Date().toISOString() }
});

export const Records = mongoose.model('Records', recordSchema);
