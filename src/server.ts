import * as Hapi from 'hapi';

import { recordRoutes } from './routes/records.route';
import { categoryRoutes } from './routes/categories.route';

import mongoose from 'mongoose';
import { connectionString } from './config';
import { Records } from './mongodb.models/record.model';

mongoose
  .connect(
    connectionString,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));

export const server = new Hapi.Server({
  port: process.env.port || 3000,
  routes: {
    cors: {
      origin: ['*']
    }
  }
});

server.route({
  method: 'GET',
  path: '/',
  handler: function() {
    return 'Hello, World';
  }
});

server.route(recordRoutes);
server.route(categoryRoutes);

// start the server
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
