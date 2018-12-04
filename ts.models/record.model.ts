import { RecordType } from "../src/enums/recordtype.enum";

export interface IRecord {
  _id: string;
  value: number;
  description: string;

  username: string;
  category: string;

  type: RecordType;
}
