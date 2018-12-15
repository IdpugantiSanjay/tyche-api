import * as Joi from 'joi';
import * as Hapi from 'hapi';

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
    category: Joi.string().required()
  });

  return schema;
}

function routeParamsUsernameSchema() {
  const schema = Joi.string()
    .required()
    .min(3)
    .max(128);
  return schema;
}

export function addRecordRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: addRecordRoutePayloadSchema(),
    params: { username: routeParamsUsernameSchema() },
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}

export function routeParamsRecordIdSchema() {
  const schema = Joi.string().regex(new RegExp('^[0-9a-fA-F]{24}$'));
  return schema;
}

export function searchRecordsRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    params: { username: routeParamsUsernameSchema() },
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}

export function updateRecordRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: updateRecordRoutePayloadSchema(),
    params: { username: routeParamsUsernameSchema(), id: routeParamsRecordIdSchema() },
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}

export function deleteRecordRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    params: { username: routeParamsUsernameSchema(), id: routeParamsRecordIdSchema() },
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}

export function updateRecordRoutePayloadSchema() {
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

export function totalSumRouteValidate() {
  return {
    params: { username: routeParamsUsernameSchema() },
    query: { startTime: Joi.string().required(), endTime: Joi.string().required() }
  } as Hapi.RouteOptionsValidate;
}
