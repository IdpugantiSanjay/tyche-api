import * as Hapi from 'hapi';
import { User } from '../ts.models/user.model';
import { createUser, searchUser } from '../services/auth.service';
import { createUserRouteValidate, searchUserRouteValidate } from '../validators/auth-route.validators';

const searchUserRoute: Hapi.ServerRoute = {
  path: '/api/users/search',
  method: 'POST',
  options: {
    validate: searchUserRouteValidate(),
    handler: function(request: Hapi.Request) {
      return searchUser(request.payload as User);
    }
  }
};

const createUserRoute: Hapi.ServerRoute = {
  path: '/api/users',
  method: 'POST',
  options: {
    validate: createUserRouteValidate(),
    handler: function(request: Hapi.Request) {
      return createUser(request.payload as User);
    }
  }
};

export const authRoutes = [searchUserRoute, createUserRoute];
