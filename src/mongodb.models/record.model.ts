import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  value: { type: Number },
  description: { type: String },
  username: { type: String },
  category: { type: String },
  createdDate: { type: Date, default: new Date().toISOString() }
});

export const Records = mongoose.model("Records", recordSchema);
