import mongoose from 'mongoose';
import { AccountSchema } from './account.model';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3, maxlength: 16, unique: true },
  password: { type: String, required: true, minlength: 6 },
  email: { type: String, required: true, minlength: 6, maxlength: 128 },
  createdDate: { type: Date, default: new Date().toISOString() },
  active: { type: Boolean, default: true },
  salt: { type: String, required: true },
  accounts: { type: [AccountSchema] },
  settings: { type: Map, of: Boolean }
});

userSchema.index({ username: 1, 'accounts.accountName': 1 });

export const UserModel = mongoose.model('User', userSchema);
