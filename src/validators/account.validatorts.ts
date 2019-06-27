import { baseAuthRouteValidator, routeParamsRecordIdSchema } from './common.validators';
import * as Joi from 'joi';

function updateUserAccountSchema() {
  const schema = Joi.object().keys({
    _id: routeParamsRecordIdSchema().required(),
    accountName: Joi.string().required(),
    balance: Joi.number().required()
  });
  return schema;
}

export var updateAccountValidators = Object.create(baseAuthRouteValidator, {
  payload: { value: updateUserAccountSchema(), writable: true }
});
