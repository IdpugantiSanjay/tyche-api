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
  addRecordRouteValidate,
  searchRecordsRouteValidate,
  updateRecordRouteValidate,
  deleteRecordRouteValidate
} from '../validators/records-route.validators';
import { AxiosResponse } from 'axios';

const searchRecordsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'GET',
  options: {
    validate: searchRecordsRouteValidate(),
    handler: function(request: Hapi.Request) {
      const results = searchRecords(request.params.username, request.query as any);
      return results;
    },
    timeout: { server: 1000 }
  }
};

// add a user record
const addRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'POST',
  options: {
    validate: addRecordRouteValidate(),
    handler: function(request: Hapi.Request) {
      return createRecord(request.params.username, request.payload as IRecord);
    }
  }
};

const updateRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'PUT',
  options: {
    validate: updateRecordRouteValidate(),
    handler: function(request: Hapi.Request) {
      return updateRecord(request.params.id, request.payload as IRecord);
    }
  }
};

const deleteRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'DELETE',
  options: {
    validate: deleteRecordRouteValidate(),
    handler: function(request: Hapi.Request) {
      return deleteRecord(request.params.id);
    }
  }
};

const categoryGroupedSumRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/categories/sum',
  method: 'GET',
  options: {
    handler: async function(request: Hapi.Request) {
      return categorySum(request.params.username);
    }
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
    }
  }
};

const statisticsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/statistics',
  method: 'GET',
  options: {
    handler: function(request: Hapi.Request) {
      return recordsStatistics(request.params.username);
    }
  }
};

export const recordRoutes = [
  searchRecordsRoute,
  addRecordRoute,
  updateRecordRoute,
  deleteRecordRoute,
  exportRecordsRoute,
  statisticsRoute,
  categoryGroupedSumRoute
];
