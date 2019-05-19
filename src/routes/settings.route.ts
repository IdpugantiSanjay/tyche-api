import * as Hapi from 'hapi';

import { saveUserSettings, userSettings } from '../services/settings.service';

const userSettingsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/settings',
  method: 'GET',
  options: {
    handler: function(request: Hapi.Request) {
      return userSettings(request.params.username);
    }
  }
};

const saveUserSettingsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/settings',
  method: 'POST',
  options: {
    handler: function(request: Hapi.Request) {
      return saveUserSettings(request.params.username, request.payload as any);
    }
  }
};

export const settingRoutes = [userSettingsRoute, saveUserSettingsRoute];
