import * as Hapi from 'hapi';

import {
  searchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  recordsStatistics,
  exportRecords,
  categorySum
} from '../services/records.service';
import { IRecord } from '../ts.models/record.model';
import {
  addRecordRouteValidator,
  updateRecordRouteValidator,
  deleteRecordRouteValidator
} from '../validators/records-route.validators';
import { AxiosResponse } from 'axios';
import { baseRouteValidator } from '../validators/common.validators';

const searchRecordsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'GET',
  options: {
    validate: baseRouteValidator,
    handler: function(request: Hapi.Request) {
      const results = searchRecords(request.params.username, request.query as any);
      return results;
    },
    timeout: { server: 1000 },
    auth: 'jwt'
  }
};

// add a user record
const addRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'POST',
  options: {
    validate: addRecordRouteValidator,
    handler: function(request: Hapi.Request) {
      return createRecord(request.params.username, request.payload as IRecord);
    },
    auth: 'jwt'
  }
};

const updateRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'PUT',
  options: {
    validate: updateRecordRouteValidator,
    handler: function(request: Hapi.Request) {
      return updateRecord(request.params.id, request.payload as IRecord);
    },
    auth: 'jwt'
  }
};

const deleteRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'DELETE',
  options: {
    validate: deleteRecordRouteValidator,
    handler: function(request: Hapi.Request) {
      return deleteRecord(request.params.id);
    },
    auth: 'jwt'
  }
};

const categoryGroupedSumRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/categories/sum',
  method: 'GET',
  options: {
    handler: async function(request: Hapi.Request) {
      return categorySum(request.params.username);
    },
    auth: 'jwt'
  }
};

const exportRecordsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/export',
  method: 'GET',
  options: {
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      const serverResponse = (await exportRecords(request.params.username)) as AxiosResponse;
      return h
        .response({ data: serverResponse.data || '' })
        .type('text/plain')
        .code(200);
    },
    auth: 'jwt'
  }
};

const importRecordsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/import',
  method: 'POST',
  options: {
    handler: async function(_request: Hapi.Request, _h: Hapi.ResponseToolkit) {
      return 'Imported File';
    },
    auth: 'jwt'
  }
};

const statisticsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/statistics',
  method: 'GET',
  options: {
    handler: function(request: Hapi.Request) {
      return recordsStatistics(request.params.username);
    },
    auth: 'jwt'
  }
};

export const recordRoutes = [
  searchRecordsRoute,
  addRecordRoute,
  updateRecordRoute,
  deleteRecordRoute,
  exportRecordsRoute,
  statisticsRoute,
  categoryGroupedSumRoute,
  importRecordsRoute
];
