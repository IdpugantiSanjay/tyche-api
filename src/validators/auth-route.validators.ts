import * as Joi from 'joi';
import { baseAuthRouteValidator } from './common.validators';

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

export var createUserRouteValidator = Object.create(baseAuthRouteValidator, {
  payload: { value: createUserPayloadSchema(), writable: true }
});

export var searchUserRouteValidator = Object.create(baseAuthRouteValidator, {
  payload: { value: searchUserRoutePayloadSchema(), writable: true }
});
