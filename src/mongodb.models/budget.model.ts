import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  username: { type: String, required: true },
  name: { type: String, required: true },
  period: { type: String },
  createdDate: { type: Date, default: new Date().toISOString() }
});

export const Budget = mongoose.model('budgets', budgetSchema);