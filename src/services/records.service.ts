import { Record } from '../mongodb.models/record.model';
import { IRecord } from '../../ts.models/record.model';

async function createRecord(record: IRecord) {
  const response = await Record.create(record);
  return response;
}

async function updateRecord(record: IRecord) {
  const response = await Record.findByIdAndUpdate(record._id, record);
  return response;
}

async function deleteRecord(id: string) {
  const response = await Record.findByIdAndDelete(id);
  return response;
}

async function searchRecord(record: IRecord) {
  const response = await Record.findOne(record);
  return response;
}

async function searchRecords(id: string, record?: IRecord) {
  const response = await Record.findOne(id).find();
  return response;
}

module.exports = [createRecord, updateRecord, deleteRecord, searchRecord, searchRecords];
