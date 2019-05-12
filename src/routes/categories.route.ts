import * as Hapi from 'hapi';
import { categories, addCategory } from '../services/categories.service';
import { Category } from '../ts.models/category.model';

const categoriesRoute: Hapi.ServerRoute = {
  path: `/api/{username}/categories/{type}`,
  method: `GET`,
  options: {
    handler: async function(request: Hapi.Request) {
      return await categories(request.params.type);
    },
    cache: {
      expiresIn: 86400,
      privacy: 'public'
    }
  }
};

const addCategoryRoute: Hapi.ServerRoute = {
  path: `/api/{username}/categories`,
  method: `POST`,
  options: {
    handler: async function(request: Hapi.Request) {
      return await addCategory(request.payload as Category);
    }
  }
};

export const categoryRoutes = [categoriesRoute, addCategoryRoute];
