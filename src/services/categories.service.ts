import { CategoryModel } from '../mongodb.models/category.model';
import { Category } from '../ts.models/category.model';

export async function categories(type: string) {
  return await CategoryModel.find({ type });
}

export async function addCategory(category: Category) {
  return await CategoryModel.create(category);
}
