import * as Hapi from 'hapi';
import { getUserAccounts, saveUserAccount, deleteUserAccount } from '../services/accounts.service';
import { IAccount } from '../ts.models/account.model';

const getUserAccountsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/accounts',
  method: 'GET',
  options: {
    handler: function(request: Hapi.Request) {
      return getUserAccounts(request.params.username);
    }
  }
};

const saveUserAccountRoute: Hapi.ServerRoute = {
  path: '/api/{username}/accounts',
  method: 'POST',
  options: {
    handler: function(request: Hapi.Request) {
      return saveUserAccount(request.params.username, request.payload as IAccount);
    }
  }
};

var deleteUserAccountRoute: Hapi.ServerRoute = {
  path: '/api/{username}/accounts/{id}',
  method: 'DELETE',
  options: {
    handler: function(request: Hapi.Request) {
      return deleteUserAccount(request.params.username, request.params.id);
    }
  }
};

export const accountRoutes = [getUserAccountsRoute, saveUserAccountRoute, deleteUserAccountRoute];
