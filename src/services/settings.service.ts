import { UserModel } from '../mongodb.models/user.model';

import R from 'ramda';
import { ISettings } from '../ts.models/setting.model';

const { keys } = R;

/**
 * Create daily, weekly, monthly and yearly budgets
 * @param username
 * @param budgets budgets array containing daily, weekly, monthly and yearly budgets
 */
export async function saveUserSettings(username: string, settings: any): Promise<any> {
  var user: any = await UserModel.findOne({ username });

  // *Map data structure is chosen because a users settings are unique

  // If the user doesn't has any setting previously create a new Map object which holds his settings
  if (!user.settings) {
    user.settings = new Map();
  }

  // set saved settings user object
  keys(settings).forEach(setting => user.settings.set(setting, settings[settings]));

  // save the changes user object
  user = await user.save();

  // If the save is successful return user's settings object
  return (user && user.settings) || {};
}

/**
 * Return the settings of a user
 * @param username The name of the user whose setting to return
 */
export async function userSettings(username: string): Promise<ISettings> {
  var user: any = await UserModel.findOne({ username });
  return (user && user.settings) || {};
}
