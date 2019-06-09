import mongoose from 'mongoose';

export const AccountSchema = new mongoose.Schema({
  accountName: { type: String, required: true },
  balance: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
});
