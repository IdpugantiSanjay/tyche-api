import * as Hapi from 'hapi';
import { searchBudgets, createBudgets } from '../services/budget.service';
import { IBudget } from '../ts.models/budget.model';
import { addBudgetsRouteValidate } from '../validators/budget-route.validators';

const addBudgetsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/budgets',
  method: 'POST',
  options: {
    validate: addBudgetsRouteValidate(),
    handler: async function(request: Hapi.Request) {
      return createBudgets(request.params.username, request.payload as IBudget[]);
    }
  }
};

const searchBudgetsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/budgets',
  method: 'GET',
  options: {
    handler: async function(request: Hapi.Request) {
      return searchBudgets(request.params.username as string, request.params.name);
    }
  }
};

export const budgetRoutes = [addBudgetsRoute, searchBudgetsRoute];
