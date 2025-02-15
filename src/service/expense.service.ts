import Expense from "../model/Expense.model";
import { ExpenseAttributes } from "../type/expense.type";
import { consoleLog } from "../util/consoleLog";

export const expenseService = {
  findOneExpense: async (
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.findOne({ where: where, ...options });
    } catch (error) {
      consoleLog("Error expenseService.findOneExpense:", error);

      return 0;
    }
  },

  findAllExpense: async (
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.findAll({ where: where, ...options });
    } catch (error) {
      consoleLog("Error expenseService.findAllExpense:", error);

      return 0;
    }
  },

  findAllExpensePagination: async (
    where: Record<string, any>,
    limit: number,
    offset: number,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.findAndCountAll({
        where: where,
        limit,
        offset,
        ...options,
      });
    } catch (error) {
      consoleLog("Error expenseService.findAllExpensePagination:", error);

      return 0;
    }
  },

  createExpense: async (
    data: ExpenseAttributes,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.create(data, options);
    } catch (error) {
      consoleLog("Error expenseService.createExpense:", error);

      return 0;
    }
  },

  updateExpense: async (
    data: ExpenseAttributes,
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.update(data, { where: where, ...options });
    } catch (error) {
      consoleLog("Error expenseService.updateExpense:", error);

      return 0;
    }
  },

  fakeDeleteExpense: async (
    data: { db_status: "inactive" },
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Expense.update(data, { where: where, ...options });
    } catch (error) {
      consoleLog("Error expenseService.updateExpense:", error);

      return 0;
    }
  },
};
