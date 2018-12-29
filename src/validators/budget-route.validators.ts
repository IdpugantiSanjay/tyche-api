import * as Hapi from 'hapi';
import * as Joi from 'joi';
import { routeParamsUsernameSchema } from './common.validators';

function addBudgetsRoutePayloadSchema() {
  const schema = Joi.array()
    .length(4)
    .required()
    .items(
      Joi.object({
        value: Joi.number().required(),
        name: Joi.string().required()
      })
    );
  return schema;
}

export function addBudgetsRouteValidate(): Hapi.RouteOptionsValidate {
  return {
    payload: addBudgetsRoutePayloadSchema(),
    params: { username: routeParamsUsernameSchema() },
    options: {
      abortEarly: true,
      stripUnknown: true
    }
  } as Hapi.RouteOptionsValidate;
}
