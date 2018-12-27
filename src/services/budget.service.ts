import { Budget } from "../mongodb.models/budget.model";
import { IBudget } from "../ts.models/budget.model";

import _ from "lodash";

export async function createBudgets(
  username: string,
  budgets: IBudget[]
): Promise<any[]> {
  try {
    await Budget.deleteMany({ username });

    const validBudgets = budgets.filter(budget => !!budget.value);

    const promises = _.times(validBudgets.length, async function(index) {
      const budget = _.nth(validBudgets, index);
      return await Budget.create(Object.assign({}, budget, { username }));
    });

    const createdBudgets = await Promise.all(promises);

    return createdBudgets;
  } catch (err) {
    console.log(err);
  }

  return [];
}

export async function searchBudgets(username: string, name: string) {
  const foundBudgets = await Budget.find({ username });
  return foundBudgets;
}
