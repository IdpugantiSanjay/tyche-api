import { RecordType } from '../enums/recordtype.enum';

export interface IRecord {
  _id: string;
  value: number;
  description: string;
  category: string;
  type: RecordType;
  createdDate: Date;

  username: string;
}

export type RecordSearchParameters = {
  startDate: Date;
  endDate: Date;
};
