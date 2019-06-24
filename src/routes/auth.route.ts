import * as Hapi from 'hapi';
import { User } from '../ts.models/user.model';
import { createUser, searchUser } from '../services/auth.service';
import { createUserRouteValidate, searchUserRouteValidate } from '../validators/auth-route.validators';

import configOptions from '../options';

import jwt from 'jsonwebtoken';

const searchUserRoute: Hapi.ServerRoute = {
  path: '/api/users/search',
  method: 'POST',
  options: {
    validate: searchUserRouteValidate(),
    handler: async function (request: Hapi.Request) {
      var searchResponse = await searchUser(request.payload as User);
      var { username, password } = request.payload as User;
      (searchResponse as any).token = jwt.sign({ username, password }, configOptions.jwtAuthStrategyKey, { expiresIn: '1h' });
      return searchResponse;
    },
    auth: false
  }
};

const createUserRoute: Hapi.ServerRoute = {
  path: '/api/users',
  method: 'POST',
  options: {
    validate: createUserRouteValidate(),
    handler: function (request: Hapi.Request) {
      return createUser(request.payload as User);
    },
    auth: false
  }
};

export const authRoutes = [searchUserRoute, createUserRoute];
