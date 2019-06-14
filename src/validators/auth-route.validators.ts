import * as Hapi from 'hapi';
import * as Joi from 'joi';

function createUserPayloadSchema() {
  const schema = Joi.object().keys({
    username: Joi.string()
      .required()
      .max(28),
    password: Joi.string()
      .required()
      .max(28),
    email: Joi.string().required()
  });

  return schema;
}

function searchUserRoutePayloadSchema() {
  const schema = Joi.object().keys({
    username: Joi.string()
      .required()
      .max(128),
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
    },
    failAction: defaultFailAction
  } as Hapi.RouteOptionsValidate;
}

export function searchUserRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: searchUserRoutePayloadSchema(),
    options: {
      abortEarly: true,
      stripUnknown: true,
    },
    failAction: defaultFailAction
  } as Hapi.RouteOptionsValidate;
}



export var defaultFailAction: Hapi.Lifecycle.Method = (_request, h, error: any) => {
  return error.isJoi ? h.response(error.details[0]).takeover().code(500).message(error.details[0]) : h.response(error).takeover();
}