import { User } from '../ts.models/user.model';
import { UserModel } from '../mongodb.models/user.model';

import { randomBytes, pbkdf2Sync } from 'crypto';

import { merge, pick } from 'ramda';

export async function createUser(user: User) {
  const { hash, salt } = hashPassword(user.password);
  const response = await UserModel.create(merge(user, { password: hash, salt }));
  return response;
}

export async function searchUser(user: User) {
  const foundUser = ((await UserModel.findOne({ username: user.username })) as any) as User;
  if (verifyPassword(foundUser.password, foundUser.salt, user.password)) {
    return pick(['username', 'email', 'settings'], foundUser);
  }

  throw new Error('Invalid User');
}

function hashPassword(password: string) {
  var salt = randomBytes(128).toString('base64');
  var hash = pbkdf2Sync(password, salt, 10000, 40, 'sha1');

  return { hash: hash.toString('utf8'), salt };
}

function verifyPassword(hash: string, salt: string, password: string): boolean {
  return hash === pbkdf2Sync(password, salt, 10000, 40, 'sha1').toString('utf8');
}
