import * as Joi from 'joi';

export function routeParamsUsernameSchema() {
  const schema = Joi.string()
    .required()
    .min(3)
    .max(128);
  return schema;
}
