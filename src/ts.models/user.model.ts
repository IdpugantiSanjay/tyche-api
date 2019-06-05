import { IAccount } from './account.model';

export interface User {
  username: string;
  password: string;
  email: string;
  salt: string;
  accounts: [IAccount];
}
