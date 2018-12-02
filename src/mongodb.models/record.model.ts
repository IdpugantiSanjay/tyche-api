import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  value: { type: Number },
  description: { type: String },
  createdDate: { type: Date, default: new Date().toISOString() }
});

export const Record = mongoose.model('Record', recordSchema);
