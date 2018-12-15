import * as Hapi from 'hapi';

import { searchRecords, createRecord, updateRecord, deleteRecord, totalSum } from '../services/records.service';
import { IRecord } from '../ts.models/record.model';
import {
  addRecordRouteValidate,
  searchRecordsRouteValidate,
  updateRecordRouteValidate,
  deleteRecordRouteValidate,
  totalSumRouteValidate
} from '../validators/records-route.validators';

const searchRecordsRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'GET',
  options: {
    validate: searchRecordsRouteValidate(),
    handler: async function(request: Hapi.Request) {
      const results = searchRecords(request.params.username);
      return results;
    }
  }
};

// add a user record
const addRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records',
  method: 'POST',
  options: {
    validate: addRecordRouteValidate(),
    handler: async function(request: Hapi.Request) {
      return createRecord(request.params.username, request.payload as IRecord);
    }
  }
};

const updateRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'PUT',
  options: {
    validate: updateRecordRouteValidate(),
    handler: async function(request: Hapi.Request) {
      return updateRecord(request.params.id, request.payload as IRecord);
    }
  }
};

const deleteRecordRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/{id}',
  method: 'DELETE',
  options: {
    validate: deleteRecordRouteValidate(),
    handler: async function(request: Hapi.Request) {
      return deleteRecord(request.params.id);
    }
  }
};

const totalSumRoute: Hapi.ServerRoute = {
  path: '/api/{username}/records/total',
  method: 'GET',
  options: {
    validate: totalSumRouteValidate(),
    handler: async function(request: Hapi.Request) {
      const queryParams = request.query as Hapi.RequestQuery;
      const { startTime, endTime } = queryParams;
      return totalSum(request.params.username, new Date(startTime as string), new Date(endTime as string));
    }
  }
};

export const recordRoutes = [searchRecordsRoute, addRecordRoute, updateRecordRoute, deleteRecordRoute, totalSumRoute];
