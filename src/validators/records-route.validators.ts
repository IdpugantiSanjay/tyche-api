import * as Joi from 'joi';
import * as Hapi from 'hapi';
import { routeParamsRecordIdSchema, baseRouteValidator } from './common.validators';

function addRecordRoutePayloadSchema() {
  const schema = Joi.object().keys({
    value: Joi.number()
      .min(1)
      .max(100_000)
      .required(),
    description: Joi.string()
      .max(128)
      .optional(),
    createdDate: Joi.date().required(),
    type: Joi.number()
      .min(1)
      .max(2)
      .required(),
    category: Joi.string().required(),
    accountId: Joi.any() // allow any schema type number / string
  });

  return schema;
}

function updateRecordRoutePayloadSchema() {
  const schema = Joi.object().keys({
    value: Joi.number()
      .min(1)
      .max(100_000)
      .required(),
    description: Joi.string()
      .max(128)
      .optional(),
    date: Joi.date().required(),
    type: Joi.number()
      .min(1)
      .max(2)
  });

  return schema;
}

export var addRecordRouteValidator = Object.create(baseRouteValidator, {
  payload: { value: addRecordRoutePayloadSchema(), writable: true }
});

export var updateRecordRouteValidator: Hapi.RouteOptionsValidate = Object.create(baseRouteValidator, {
  payload: { value: updateRecordRoutePayloadSchema(), writable: true }
});

export var deleteRecordRouteValidator: Hapi.RouteOptionsValidate = Object.create(baseRouteValidator, {
  id: { value: routeParamsRecordIdSchema(), writable: true }
});

export var totalSumRouteValidator = Object.create(baseRouteValidator, {
  query: { value: { startTime: Joi.string().required(), endTime: Joi.string().required() }, writable: true }
});
