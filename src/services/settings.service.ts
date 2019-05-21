import { UserModel } from '../mongodb.models/user.model';

import * as R from 'ramda';

const { pipe, forEach, keys, pick } = R;

/**
 * Create daily, weekly, monthly and yearly budgets
 * @param username
 * @param budgets budgets array containing daily, weekly, monthly and yearly budgets
 */
export async function saveUserSettings(username: string, settings: any): Promise<any> {
  var user: any = await UserModel.findOne({ username });

  if (!user.settings) {
    user.settings = new Map();
  }

  pipe(forEach((key: string) => user.settings.set(key, settings[key])))(keys(settings as Object));

  return pick(['settings'], await user.save());
}

export async function userSettings(username: string) {
  var user: any = await UserModel.findOne({ username }).select('settings');
  return user;
}
