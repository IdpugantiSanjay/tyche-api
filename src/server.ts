import * as Hapi from 'hapi';

import { recordRoutes } from './routes/records.route';

const server = new Hapi.Server({ port: 3000 || process.env.port });

// all the user records

// edit a user record

// delete a user record

server.route(recordRoutes);

// start the server
server.start();
