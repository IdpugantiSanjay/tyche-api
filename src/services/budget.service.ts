import { Budget } from '../mongodb.models/budget.model';
import { IBudget } from '../ts.models/budget.model';

import _ from 'lodash';
import { BudgetName } from '../enums/budgetname.enum';

/**
 * Create daily, weekly, monthly and yearly budgets
 * @param username
 * @param budgets budgets array containing daily, weekly, monthly and yearly budgets
 */
export async function createBudgets(username: string, budgets: IBudget[]): Promise<any[]> {
  // delete all data initially
  await Budget.deleteMany({ username });

  const responses: Array<Promise<any>> = [];
  budgets.forEach(function(budget) {
    const createdPromise = Budget.create(Object.assign({}, budget, { username }));
    responses.push(createdPromise);
  });
  return await Promise.all(responses);
}

export async function searchBudgets(username: string, name: string) {
  const foundBudgets = await Budget.find({ username });
  return foundBudgets;
}

export async function budgetsConsumption(username: string) {
  const dailyBudget = Budget.find({ username, name: BudgetName.DAILY });
  const weeklyBudget = Budget.find({ username, name: BudgetName.WEEKLY });
  const monthlyBudget = Budget.find({ username, name: BudgetName.MONHTLY });
  const yearlyBudget = Budget.find({ username, name: BudgetName.YEARLY });
}

function dayRange(): [Date, Date] {
  const today = new Date();
  const tommorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  today.setHours(0, 0, 0, 0);
  tommorrow.setHours(0, 0, 0);
  return [today, tommorrow];
}

function monthRange(): [Date, Date] {
  const [thisMonth, thisYear] = [new Date().getMonth(), new Date().getFullYear()];
  return [new Date(thisYear, thisMonth, 1), new Date(thisYear, thisMonth + 1, 0)];
}

function yearRange(): [Date, Date] {
  const thisYear = new Date().getFullYear();
  return [new Date(thisYear, 0, 1), new Date(thisYear, 11, 31)];
}

function weekRange(): [Date, Date] {
  const curr = new Date(); // get current date
  const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  const firstday = new Date(curr.setDate(first));
  const lastday = new Date(curr.setDate(last));

  firstday.setHours(0, 0, 0);
  lastday.setHours(0, 0, 0);
  return [firstday, lastday];
}
