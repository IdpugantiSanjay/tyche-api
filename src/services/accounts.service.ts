import { UserModel } from '../mongodb.models/user.model';
import { User } from '../ts.models/user.model';
import { IAccount } from '../ts.models/account.model';

/**
 * Create daily, weekly, monthly and yearly budgets
 * @param username
 * @param budgets budgets array containing daily, weekly, monthly and yearly budgets
 */
export async function saveUserAccount(username: string, account: IAccount): Promise<boolean> {
  await UserModel.findOneAndUpdate({ username }, { $push: { accounts: account } });
  return true;
}

export async function updateUserAccount(username: string, account: IAccount): Promise<IAccount> {
  return await UserModel.findOneAndUpdate(
    { username, 'accounts._id': account._id },
    { $set: { 'accounts.$': account } }
  )
    .lean()
    .exec()
    .then((user: User) => user.accounts)
    .then(getUpdatedAccount);

  function getUpdatedAccount(accounts: Array<IAccount>): IAccount {
    var updatedUserAccountIndex = accounts.findIndex(account => (account._id = account._id));
    return accounts[updatedUserAccountIndex];
  }
}

/**
 * Return the settings of a user
 * @param username The name of the user whose setting to return
 */
export async function getUserAccounts(username: string): Promise<Array<IAccount>> {
  const user: User = await UserModel.findOne({ username }, { _id: 0, accounts: 1 })
    .lean(true)
    .exec();

  return user.accounts || [];
}

export async function deleteUserAccount(username: string, _id: string): Promise<any> {
  var user: User = await UserModel.findOneAndUpdate({ username }, { $pull: { accounts: { _id } } }).lean();
  return user;
}
