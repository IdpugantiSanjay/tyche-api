import * as Hapi from 'hapi';
import webpush from 'web-push';

import { recordRoutes } from './routes/records.route';
import { categoryRoutes } from './routes/categories.route';

import mongoose from 'mongoose';

import { connectionString } from './config';
import { budgetRoutes } from './routes/budgets.route';
import { authRoutes } from './routes/auth.route';

mongoose.connect(connectionString, { useNewUrlParser: true }).catch(err => console.log(err));

export const server = new Hapi.Server({
  port: process.env.port || 3000,
  routes: {
    cors: {
      origin: ['*']
    }
  },
  debug: { request: ['error', 'uncaught'] }
});

const publicKey =
  'BNsTGbCeYfPwet42DdxaJYbuDfJQUwMjASNHfbWdIk0ian-e0v6t13iKyIyJbtjdPLOkNFSe-fBneIgR8PvmqV0';
const privateKey = 'RKs66TcEnr2N8Dk1mCVJ-GTmsNvVAJHo97uS6rjhAnY';

webpush.setVapidDetails('mailto:isanjay112@gmail.com', publicKey, privateKey);

server.route({
  method: 'GET',
  path: '/',
  handler: function() {
    return 'Hello, World';
  }
});

server.route({
  method: 'POST',
  path: '/subscribe',
  handler: async function(request: Hapi.Request) {
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
server.route(authRoutes);

// start the server
const init = async () => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
};

init();
