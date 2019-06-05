import { RecordType } from '../enums/recordtype.enum';
import { ObjectID } from 'bson';

export interface IRecord {
  _id: string;
  value: number;
  description: string;
  category: string;
  type: RecordType;
  createdDate: Date;
  accountId: ObjectID;
  username: string;
}

export type RecordSearchParameters = {
  startDate: Date;
  endDate: Date;
};
