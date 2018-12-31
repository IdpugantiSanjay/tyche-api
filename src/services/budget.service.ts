import { Budget } from '../mongodb.models/budget.model';
import { IBudget } from '../ts.models/budget.model';

import R from 'ramda';

const { merge, map } = R;

/**
 * Create daily, weekly, monthly and yearly budgets
 * @param username
 * @param budgets budgets array containing daily, weekly, monthly and yearly budgets
 */
export async function createBudgets(username: string, budgets: IBudget[]): Promise<any[]> {
  const promises = map(budget => Budget.updateOne(budget._id, merge(budget, { username })), budgets);

  return await Promise.all(promises);
}

export async function searchBudgets(username: string, name: string) {
  return await Budget.find({ username });
}
