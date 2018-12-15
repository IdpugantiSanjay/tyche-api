import { CategoryModel } from '../mongodb.models/category.model';
import { Category } from '../ts.models/category.model';

export async function categories() {
  const categories = await CategoryModel.find({});
  return categories;
}

export async function addCategory(category: Category) {
  const response = await CategoryModel.create(category);
  return response;
}
