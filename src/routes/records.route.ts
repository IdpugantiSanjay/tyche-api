import * as Hapi from 'hapi';

const records: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'GET',
  handler: function(request: Hapi.Request) {
    return [{ id: 1, amount: 250 }];
  }
};

// add a user record
const addRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'POST',
  handler: function(request: Hapi.Request) {}
};

const updateRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'PUT',
  handler: function(request: Hapi.Request) {}
};

const deleteRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'DELETE',
  handler: function(request: Hapi.Request) {}
};

export const recordRoutes = [records, addRecord];
