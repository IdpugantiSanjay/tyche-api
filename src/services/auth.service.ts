import { User } from '../ts.models/user.model';
import { UserModel } from '../mongodb.models/user.model';

import { merge, pick } from 'ramda';
import { hash, verify } from 'argon2';

export async function createUser(user: User) {
  const hashedPassword = await hash(user.password);
  const response = await UserModel.create(merge(user, { password: hashedPassword }));
  return response;
}

export async function searchUser(user: User) {
  const foundUser = ((await UserModel.findOne({ username: user.username })) as any) as User;
  if (await verify(foundUser.password, user.password)) {
    return pick(['username', 'email'], foundUser);
  }

  throw new Error('Invalid User');
}
