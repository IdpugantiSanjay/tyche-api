import * as Joi from 'joi';
import * as Hapi from 'hapi';

export function routeParamsUsernameSchema() {
  const schema = Joi.string()
    .required()
    .min(3)
    .max(128);
  return schema;
}

export function routeParamsRecordIdSchema() {
  const schema = Joi.string().regex(new RegExp('^[0-9a-fA-F]{24}$'));
  return schema;
}

export var defaultFailAction: Hapi.Lifecycle.Method = (_request, h, error: any) => {
  return error.isJoi
    ? h
        .response(error.details[0])
        .takeover()
        .code(500)
        .message(error.details[0])
    : h.response(error).takeover();
};

export var baseRouteValidator: Hapi.RouteOptionsValidate = {
  params: { username: routeParamsUsernameSchema() },
  options: { stripUnknown: true, abortEarly: true },
  failAction: defaultFailAction
};

export var baseAuthRouteValidator: Hapi.RouteOptionsValidate = {
  options: { stripUnknown: true, abortEarly: true },
  failAction: defaultFailAction
};
