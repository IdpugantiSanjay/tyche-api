import { Records } from '../mongodb.models/record.model';
import { IRecord, RecordSearchParameters } from '../ts.models/record.model';
import { RecordType } from '../enums/recordtype.enum';
import Axios from 'axios';
import { Budget } from '../mongodb.models/budget.model';
import { BudgetName } from '../enums/budgetname.enum';

// import { csvServiceUrl } from '../config';

import R from 'ramda';
import { BudgetConsumption } from '../types/budgetconsumption';
import { UserModel } from '../mongodb.models/user.model';
import { ObjectID } from 'bson';

const { merge, pipe, find, propEq, propOr } = R;

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

  // Deduct if account is not cash
  // Get the deducted amount from user account balance

  if (!record.accountId) return response;

  // The following is the mongodb query
  // db.users.updateOne(
  //   { "accounts._id": ObjectId("5cf7eb030b35175ad0f2e4e2") },
  //   { $inc: { "accounts.$[elem].balance": 10  } },
  //   { arrayFilters: [ { "elem._id": ObjectId("5cf7eb030b35175ad0f2e4e2")  } ] }
  // );

  // update account balance when record with account is selected
  await UserModel.updateOne(
    { username },
    { $inc: { 'accounts.$[elem].balance': record.type == 1 ? record.value : -record.value } },
    { arrayFilters: [{ 'elem._id': new ObjectID(record.accountId) }] }
  );

  return response;
}

/**
 * Update an already existing record
 * @param id id of the record to update
 * @param record properties of the new record
 */
export async function updateRecord(id: string, record: IRecord) {
  const response = await Records.findByIdAndUpdate(id, record);
  return response;
}

/**
 * Delete a record having id
 * @param id id of the record to delete
 */
export async function deleteRecord(id: string) {
  // delete the record by id and return the deleted record
  const deletedRecord: IRecord = await Records.findByIdAndDelete(id).lean();

  // if the deleted record doesn't have accountId return the deleted document
  if (!deletedRecord.accountId) return deletedRecord;

  // update account balance when record with account is selected
  await UserModel.updateOne(
    { username: deletedRecord.username },
    { $inc: { 'accounts.$[elem].balance': deletedRecord.value } },
    { arrayFilters: [{ 'elem._id': new ObjectID(deletedRecord.accountId) }] }
  );

  return deletedRecord;
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
export async function searchRecords(username: string, searchFilters?: RecordSearchParameters) {
  var response;
  if (searchFilters && !searchFilters.limit && !searchFilters.skip) {
    response = await Records.find(buildSearchQuery()).sort({ createdDate: -1 });
  } else if (searchFilters && searchFilters.limit && searchFilters.skip) {
    response = await Records.find(buildSearchQuery())
      .sort({ createdDate: -1 })
      // .skip(+searchFilters.skip)
      .limit(+searchFilters.limit);
  }
  return response;

  /**
   * Return a mongodb find query object based on inputs
   */
  function buildSearchQuery(): any {
    if (!searchFilters) return { username };

    var query: any = { username };

    if (searchFilters.startDate || searchFilters.endDate) {
      query.createdDate = {};
    }

    if (searchFilters.startDate) {
      query.createdDate.$gte = searchFilters.startDate;
    }

    if (searchFilters.endDate) {
      query.createdDate.$lte = searchFilters.endDate;
    }

    if (searchFilters.accountId) {
      query.accountId = new ObjectID(searchFilters.accountId);
    }

    return query;
  }
}

/**
 * Return sum of all records between startTime and endTime
 * @param username username of the records
 * @param startTime starting time of createdDate of the record
 * @param endTime ending time of createdDate of the record
 */
async function totalSum(username: string, startTime: Date, endTime: Date): Promise<any> {
  const aggregates = await Records.aggregate([
    { $match: { username, createdDate: { $lte: endTime, $gte: startTime } } },
    { $group: { _id: '$type', total: { $sum: '$value' } } }
  ]);

  const total = aggregateTotal(aggregates);
  return total(RecordType.Income) - total(RecordType.Expense);
}

/**
 * Return a function that returns total value of type of aggregate
 * @param aggregates positive and negative aggregate totals
 */
type Aggregate = { _id: number; total: number };
function aggregateTotal(aggregates: Array<Aggregate>): (type: number) => number {
  return function (type: number) {
    // find aggregate object having _id as type
    const findAggregate: (aggregates: Array<Aggregate>) => Aggregate | undefined = find(propEq('_id', type));
    // get total property
    const total: (aggregate: Aggregate | undefined) => number = propOr(0, 'total');

    return pipe(
      findAggregate,
      total
    )(aggregates) as number;
  };
}

export async function categorySum(username: string) {
  const monthGroupedSum = await groupedSum(username)();

  return monthGroupedSum;
}

function groupedSum(username: string) {
  return function () {
    return Records.aggregate([
      { $match: { username } },
      { $group: { _id: '$category', total: { $sum: '$value' } } },
      { $sort: { total: -1 } }
    ]);
  };
}

/**
 * Call external service to convert JSON data structure to CSV format
 * @param username
 */
export async function exportRecords(username: string) {
  const records = await Records.find({ username });
  // call external service to process user records in json format
  return await Axios.post('', records, config);
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
    var curr = new Date();
    var day = curr.getDay();
    //will return firstday (ie sunday) of the week
    var firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000);
    //adding (60*60*6*24*1000) means adding six days to the firstday which results in lastday (saturday) of the week
    var lastday = new Date(curr.getTime() + 60 * 60 * 24 * 6 * 1000);

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
