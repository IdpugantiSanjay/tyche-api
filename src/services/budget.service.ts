import { Budget } from '../mongodb.models/budget.model';
import { IBudget } from '../ts.models/budget.model';

import _ from 'lodash';
import { BudgetName } from '../enums/budgetname.enum';
import { totalSum } from './records.service';

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
