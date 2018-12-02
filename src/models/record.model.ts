import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  createdDate: { type: Date },
  value: { type: Number },
  description: { type: String }
});

export const Record = mongoose.model('Record', recordSchema);
