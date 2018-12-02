import * as Hapi from 'hapi';

const server = new Hapi.Server({ port: 3000 || process.env.port });

// all the user records
const records: Hapi.ServerRoute = {
  path: '/api/{username}/records/',
  method: 'GET',
  handler: function(request: Hapi.Request) {
    return [{ id: 1, amount: 250 }];
  }
};

// add a user record
const addRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records/',
  method: 'POST',
  handler: function(request: Hapi.Request) {}
};

// edit a user record

// delete a user record

server.route(records);

// start the server
server.start();
