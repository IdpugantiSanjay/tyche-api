import { Records } from "../mongodb.models/record.model";
import { IRecord } from "../../ts.models/record.model";

export async function createRecord(record: IRecord) {
  const response = await Records.create(record);
  return response;
}

export async function updateRecord(id: string, record: IRecord) {
  const response = await Records.findOneAndUpdate({ _id: id }, record);
  return response;
}

export async function deleteRecord(id: string) {
  const response = await Records.findByIdAndDelete(id);
  return response;
}

export async function searchRecord(record: IRecord) {
  const response = await Records.findOne(record);
  return response;
}

export async function searchRecords(username: string, record?: IRecord) {
  try {
    const response = await Records.find({ username });
    return response;
  } catch (error) {
    throw error;
  }
}
