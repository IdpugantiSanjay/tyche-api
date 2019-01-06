import * as Hapi from 'hapi';
import * as Joi from 'joi';

function createUserPayloadSchema() {
  const schema = Joi.object().keys({
    username: Joi.string()
      .required()
      .max(28),
    password: Joi.string()
      .required()
      .max(28)
  });

  return schema;
}

function searchUserRoutePayloadSchema() {
  const schema = Joi.object().keys({
    username: Joi.string()
      .required()
      .max(28),
    password: Joi.string()
      .required()
      .max(28)
  });

  return schema;
}

export function createUserRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: createUserPayloadSchema(),
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}

export function searchUserRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: searchUserRoutePayloadSchema(),
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}
