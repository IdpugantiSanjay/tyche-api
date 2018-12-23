import * as Hapi from 'hapi';

const addBudget: Hapi.ServerRoute = {
  path: '/api/{username}/budgets',
  method: 'POST',
  options: {
    // validate: searchRecordsRouteValidate(),
    handler: async function(request: Hapi.Request) {}
  }
};

const searchBudget: Hapi.ServerRoute = {
  path: '/api/{username}/budgets',
  method: 'GET',
  options: {
    // validate: searchRecordsRouteValidate(),
    handler: async function(request: Hapi.Request) {}
  }
};
