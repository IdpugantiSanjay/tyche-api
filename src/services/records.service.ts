import _ from 'lodash';

import { Records } from '../mongodb.models/record.model';
import { IRecord } from '../ts.models/record.model';
import { RecordType } from '../enums/recordtype.enum';
import Axios from 'axios';

/**
 * Create a record with username
 * @param username username to create a record with
 * @param record record to create a record having properties of record
 */
export async function createRecord(username: string, record: IRecord) {
  const recordWithUsername = _.assign({}, record, { username });
  const response = await Records.create(recordWithUsername);
  return response;
}

/**
 * Update an already existing record
 * @param id id of the record to update
 * @param record properties of the new record
 */
export async function updateRecord(id: string, record: IRecord) {
  const response = await Records.findOneAndUpdate({ _id: id }, record);
  return response;
}

/**
 * Delete a record having id
 * @param id id of the record to delete
 */
export async function deleteRecord(id: string) {
  const response = await Records.findByIdAndDelete(id);
  return response;
}

/**
 * Return a record matching required properties
 * @param record record properties to search on
 */
export async function searchRecord(record: IRecord) {
  const response = await Records.findOne(record);
  return response;
}

/**
 * Return records of username
 * @param username username of the filters
 * @param record record object conatining any properties to filter on
 */
export async function searchRecords(username: string, record?: IRecord) {
  const response = await Records.find({ username }).sort({ createdDate: -1 });
  return response;
}

/**
 * Return sum of all records between startTime and endTime
 * @param username username of the records
 * @param startTime starting time of createdDate of the record
 * @param endTime ending time of createdDate of the record
 */
export async function totalSum(username: string, startTime: Date, endTime: Date): Promise<any> {
  const aggregateResult = await Records.aggregate([
    { $match: { username, createdDate: { $lte: endTime, $gte: startTime } } },
    { $group: { _id: '$type', total: { $sum: '$value' } } }
  ]);

  const total = aggregateTotal(aggregateResult);
  return total(RecordType.Income) - total(RecordType.Expense);
}

/**
 * Return a function that returns total value of type of aggregate
 * @param aggregates positive and negative aggregate totals
 */
function aggregateTotal(aggregates: Array<any>): (type: number) => number {
  return function(type: number) {
    return (_.find(aggregates, ['_id', type]) || {}).total || 0;
  };
}

export async function exportRecords(username: string) {
  const records = await Records.find({ username });

  try {
    const response = await Axios.post('http://localhost:5000/api/csv', records, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
}
