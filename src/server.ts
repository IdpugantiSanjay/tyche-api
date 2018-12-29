import * as Hapi from 'hapi';
import webpush from 'web-push';

import { recordRoutes } from './routes/records.route';
import { categoryRoutes } from './routes/categories.route';

import mongoose from 'mongoose';

import { connectionString } from './config';
import { exportRecords } from './services/records.service';
import { budgetRoutes } from './routes/budgets.route';

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

const publicKey = 'BNsTGbCeYfPwet42DdxaJYbuDfJQUwMjASNHfbWdIk0ian-e0v6t13iKyIyJbtjdPLOkNFSe-fBneIgR8PvmqV0';
const privateKey = 'RKs66TcEnr2N8Dk1mCVJ-GTmsNvVAJHo97uS6rjhAnY';

webpush.setVapidDetails('mailto:isanjay112@gmail.com', publicKey, privateKey);

server.route({
  method: 'GET',
  path: '/',
  handler: exportRecords
});

server.route({
  method: 'POST',
  path: '/subscribe',
  handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
    const subscription = request.payload;
    const payload = JSON.stringify({ title: 'Payment Pending' });

    webpush.sendNotification(subscription as any, payload as any).catch(console.log);
    // webpush.sendNotification(subscription as any, payload as any).catch(console.log);

    return 'Sent Notification';
  }
});

server.route(recordRoutes);
server.route(categoryRoutes);
server.route(budgetRoutes);

// start the server
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
