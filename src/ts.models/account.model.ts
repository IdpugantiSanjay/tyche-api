import { ObjectID } from 'bson';

export interface IAccount {
  accountName: string;
  balance: number;
  _id: ObjectID;
}
