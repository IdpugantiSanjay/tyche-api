import { Record } from '../mongodb.models/record.model';
import { IRecord } from '../../ts.models/record.model';

export async function createRecord(record: IRecord) {
  const response = await Record.create(record);
  return response;
}

export async function updateRecord(record: IRecord) {
  const response = await Record.findByIdAndUpdate(record._id, record);
  return response;
}

export async function deleteRecord(id: string) {
  const response = await Record.findByIdAndDelete(id);
  return response;
}

export async function searchRecord(record: IRecord) {
  const response = await Record.findOne(record);
  return response;
}

export async function searchRecords(id: string, record?: IRecord) {
  console.log('searching');
  const response = await Record.findOne(id).find();
  return response;
}
