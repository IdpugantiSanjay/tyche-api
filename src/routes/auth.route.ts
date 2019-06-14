import * as Hapi from 'hapi';
import { User } from '../ts.models/user.model';
import { createUser, searchUser } from '../services/auth.service';
import { createUserRouteValidate, searchUserRouteValidate } from '../validators/auth-route.validators';

const searchUserRoute: Hapi.ServerRoute = {
  path: '/api/users/search',
  method: 'POST',
  options: {
    validate: searchUserRouteValidate(),
    handler: async function (request: Hapi.Request) {
      request.log('log', 'Started Searching for Users');
      var searchResponse = await searchUser(request.payload as User);
      request.log('log', 'Found the User');
      console.log(request.logs);
      return searchResponse;
    },
    log: { collect: true },
  }
}


const createUserRoute: Hapi.ServerRoute = {
  path: '/api/users',
  method: 'POST',
  options: {
    validate: createUserRouteValidate(),
    handler: function (request: Hapi.Request) {
      return createUser(request.payload as User);
    }
  }
};

export const authRoutes = [searchUserRoute, createUserRoute];
