import * as Hapi from 'hapi';
import webpush from 'web-push';

import { recordRoutes } from './routes/records.route';
import { categoryRoutes } from './routes/categories.route';

import mongoose from 'mongoose';

import configOptions from './options';

import { budgetRoutes } from './routes/budgets.route';
import { authRoutes } from './routes/auth.route';
import { settingRoutes } from './routes/settings.route';
// import { boomify } from 'boom';
import { accountRoutes } from './routes/accounts.route';

import { UserModel } from './mongodb.models/user.model';
import { User } from './ts.models/user.model';

import Boom from 'boom';
import { verifyPassword } from './services/auth.service';



mongoose.connect(configOptions.connectionString, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });

export const server = new Hapi.Server({
  port: process.env.port || 3000,
  routes: {
    cors: {
      origin: ['*']
    }
  },
  debug: { request: ['error', 'uncaught'] }
});

const publicKey = 'BNsTGbCeYfPwet42DdxaJYbuDfJQUwMjASNHfbWdIk0ian-e0v6t13iKyIyJbtjdPLOkNFSe-fBneIgR8PvmqV0';
const privateKey = 'RKs66TcEnr2N8Dk1mCVJ-GTmsNvVAJHo97uS6rjhAnY';

webpush.setVapidDetails('mailto:isanjay112@gmail.com', publicKey, privateKey);

server.route({
  method: 'GET',
  path: '/',
  handler: function () {
    return 'Hello, World';
  }
});

server.route({
  method: 'POST',
  path: '/subscribe',
  handler: async function (request: Hapi.Request) {
    const subscription = request.payload;
    const payload = JSON.stringify({ title: 'Payment Pending' });

    webpush.sendNotification(subscription as any, payload as any).catch(console.log);
    // webpush.sendNotification(subscription as any, payload as any).catch(console.log);

    return 'Sent Notification';
  }
});

// Transform non-boom errors into boom ones
server.ext('onPreResponse', function (request, h) {
  var response = request.response as any;

  if (response && response.output && response.output.statusCode === 401) {
    return h.response({ message: response.error || response.message }).code(401);
  }

  // Transform only server errors
  if (response.isBoom || response.isServer) {
    var errorMessage = response.error || response.message;
    return h
      .response({ message: errorMessage, statusCode: 500, error: 'Internal Server Error' })
      .code(500)
      .message(errorMessage);
  } else {
    // Otherwise just continue with previous response
    return h.continue;
  }
} as Hapi.Lifecycle.Method);

(async function () {
  async function validate(decoded: Partial<User>) {
    var { username, password } = decoded;

    var foundUser: User = await UserModel.findOne({ username })
      .lean()
      .exec();

    var userExists = verifyPassword(foundUser.password, foundUser.salt, password as string);

    if (!Boolean(userExists)) return Boom.unauthorized('UnAuthorized');

    return { isValid: Boolean(userExists) };
  }

  await server.register(require('hapi-auth-jwt2'));
  server.auth.strategy('jwt', 'jwt', {
    key: configOptions.jwtAuthStrategyKey, // Never Share your secret key
    validate: validate, // validate function defined above
    verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  });
  server.auth.default('jwt');

  server.route(recordRoutes);
  server.route(categoryRoutes);
  server.route(budgetRoutes);
  server.route(authRoutes);
  server.route(settingRoutes);
  server.route(accountRoutes);

  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
})();
