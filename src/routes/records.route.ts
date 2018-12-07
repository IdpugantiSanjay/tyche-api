import * as Hapi from "hapi";
import Boom from "boom";
import Joi from "joi";

import {
  searchRecords,
  createRecord,
  deleteRecord,
  updateRecord
} from "../services/records.service";
import { IRecord } from "../../ts.models/record.model";

/**
 * Validate if request contains correct payload details
 * @param request request object containing new record details as payload
 * @param h
 */
const validateRecord = function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const record: IRecord = request.payload as any;
  // TODO replace with Joi schema
  if (record.description && record.value && record.category) {
    return true;
  } else {
    throw Boom.badRequest("Invalid record details");
  }
};

/**
 * Check if the http request has record id in params
 * @param request http request object containing the id of the record
 * @param h response toolkit object
 */
const validateRecordId = function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
  const schema = Joi.string().min(1);

  const result = schema.validate(request.params.id);

  if (result.error) {
    throw Boom.badRequest("Invalid id");
  }
  return true;
};

const records: Hapi.ServerRoute = {
  path: "/api/{username}/records",
  method: "GET",
  options: {
    cache: {
      expiresIn: 60 * 1000,
      privacy: "public"
    },
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      const results = searchRecords(request.params.username);
      return results;
    }
  }
};

// add a user record
const addRecord: Hapi.ServerRoute = {
  path: "/api/{username}/records",
  method: "POST",
  options: {
    pre: [{ method: validateRecord, assign: "valid", failAction: "error" }],
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return createRecord(request.payload as IRecord);
    }
  }
};

const updateRecordRoute: Hapi.ServerRoute = {
  path: "/api/{username}/records/{id}",
  method: "PUT",
  options: {
    pre: [{ method: validateRecord, assign: "valid", failAction: "error" }],
    handler: async function(request: Hapi.Request, h: Hapi.ResponseToolkit) {
      return updateRecord(request.params.id, request.payload as IRecord);
    }
  }
};

const deleteRecordRoute: Hapi.ServerRoute = {
  path: "/api/{username}/records/{id}",
  method: "DELETE",
  options: {
    pre: [{ method: validateRecordId, assign: "valid", failAction: "error" }],
    handler: async function(request: Hapi.Request) {
      return deleteRecord(request.params.id);
    }
  }
};

export const recordRoutes = [records, addRecord, deleteRecordRoute, updateRecordRoute];

// TODO remove pre handler with validate property
