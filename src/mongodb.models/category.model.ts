import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String },
  type: { type: String }
});

export const CategoryModel = mongoose.model("Category", categorySchema);
