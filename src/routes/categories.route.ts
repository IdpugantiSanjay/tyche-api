import * as Hapi from 'hapi';
import { categories, addCategory } from '../services/categories.service';
import { Category } from '../ts.models/category.model';

const categoriesRoute: Hapi.ServerRoute = {
  path: `/api/{username}/categories`,
  method: `GET`,
  options: {
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return await categories();
    },
    cache: {
      expiresIn: 60 * 60 * 60,
      privacy: 'public'
    }
  }
};

const addCategoryRoute: Hapi.ServerRoute = {
  path: `/api/{username}/categories`,
  method: `POST`,
  options: {
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return await addCategory(request.payload as Category);
    }
  }
};

export const categoryRoutes = [categoriesRoute, addCategoryRoute];
