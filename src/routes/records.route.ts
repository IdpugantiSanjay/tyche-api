import * as Hapi from 'hapi';

import Boom from 'boom';

import { searchRecords, createRecord } from '../services/records.service';

const validateRecord = function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  throw Boom.badRequest('Fuck this shit');
};

const records: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'GET',
  handler: searchRecords
};

// add a user record
const addRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'POST',
  options: {
    pre: [{ method: validateRecord, assign: 'valid', failAction: 'error' }],
    handler: createRecord
  }
};

const updateRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'PUT',
  handler: function(request: Hapi.Request) {}
};

const deleteRecord: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'DELETE',
  handler: function(request: Hapi.Request) {}
};

export const recordRoutes = [records, addRecord];
