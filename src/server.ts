import * as Hapi from 'hapi';

import { recordRoutes } from './routes/records.route';
import { categoryRoutes } from './routes/categories.route';

import mongoose from 'mongoose';
import { connectionString } from './config';

mongoose
  .connect(
    connectionString,
    { useNewUrlParser: true }
  )
  .catch(err => console.log(err));

export const server = new Hapi.Server({
  port: 3000 || process.env.port,
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
