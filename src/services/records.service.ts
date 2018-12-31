import { Records } from '../mongodb.models/record.model';
import { IRecord } from '../ts.models/record.model';
import { RecordType } from '../enums/recordtype.enum';
import Axios from 'axios';
import { Budget } from '../mongodb.models/budget.model';
import { BudgetName } from '../enums/budgetname.enum';

import R from 'ramda';
import { csvServiceUrl } from '../config';

const { merge } = R;

const config = {
  headers: { 'Content-Type': 'application/json' }
};

/**
 * Create a record with username
 * @param username username to create a record with
 * @param record record to create a record having properties of record
 */
export async function createRecord(username: string, record: IRecord) {
  const recordWithUsername = merge(record, { username });
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
    if (aggregates) {
      return aggregates.find(aggregate => aggregate._id === type);
    }
    return 0;
  };
}

/**
 * Call external service to convert JSON data structure to CSV format
 * @param username
 */
export async function exportRecords(username: string) {
  const records = await Records.find({ username });

  try {
    // call external service to process user records in json format
    const response = await Axios.post(csvServiceUrl, records, config);
    // the response.data contains base64 encoded csv of records
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function recordsStatistics(username: string) {
  const budget = statistics(username);

  const overallStats = [
    budget(BudgetName.DAILY)(...Range.day),
    budget(BudgetName.WEEKLY)(...Range.week),
    budget(BudgetName.MONTHLY)(...Range.month),
    budget(BudgetName.YEARLY)(...Range.year)
  ];

  return await Promise.all(overallStats);

  /**
   * @param username name of the user
   */
  function statistics(username: string) {
    return function budgetRange(budgetName: BudgetName) {
      return function range(from: Date, to: Date): Promise<BudgetConsumption> {
        const budgetPromise = Budget.findOne({ username, name: budgetName });
        const consumedPromise = totalSum(username, from, to);
        return Promise.all([budgetPromise, consumedPromise]).then(calculate);
      };
    };
  }

  function calculate(response: any[]): BudgetConsumption {
    const [budget, consumed] = response;

    return {
      name: budget.name,
      percentageConsumed: consumed < 0 ? Math.abs((consumed / budget.value) * 100) : 0,
      consumed,
      label: budget.label
    };
  }
}

export class Range {
  static get day(): [Date, Date] {
    const today = new Date();
    const tommorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    today.setHours(0, 0, 0, 0);
    tommorrow.setHours(0, 0, 0);
    return [today, tommorrow];
  }

  static get week(): [Date, Date] {
    // get current date
    const curr = new Date();
    // First day is the day of the month - the day of the week
    const first = curr.getDate() - curr.getDay();
    // last day is the first day + 6
    const last = first + 6;

    const firstday = new Date(curr.setDate(first));
    const lastday = new Date(curr.setDate(last));

    firstday.setHours(0, 0, 0);
    lastday.setHours(0, 0, 0);
    return [firstday, lastday];
  }

  static get month(): [Date, Date] {
    const [thisMonth, thisYear] = [new Date().getMonth(), new Date().getFullYear()];
    return [new Date(thisYear, thisMonth, 1, 0, 0, 0), new Date(thisYear, thisMonth + 1, 0, 23, 59, 59)];
  }

  static get year(): [Date, Date] {
    const thisYear = new Date().getFullYear();
    return [new Date(thisYear, 0, 1, 0, 0, 0), new Date(thisYear, 11, 31, 23, 59, 59)];
  }
}
