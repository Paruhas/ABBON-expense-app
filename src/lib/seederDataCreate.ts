const userSeeder = require("../seeder/user_seeder.json");
const categorySeeder = require("../seeder/category_seeder.json");
const expenseSeeder = require("../seeder/expense_seeder.json");

import { categoryService } from "../service/category.service";
import { expenseService } from "../service/expense.service";
import { userService } from "../service/user.service";
import { CategoryAttributes } from "../type/category.type";
import { ExpenseAttributes } from "../type/expense.type";
import { UserAttributes } from "../type/user.type";

export const seederDataCreate = async (): Promise<boolean> => {
  const [userData, categoryData, expenseData] = await Promise.all([
    userService.findAllUser({}, { raw: true }),
    categoryService.findAllCategory({}, { raw: true }),
    expenseService.findAllExpense({}, { raw: true }),
  ]);
  if (!userData || !categoryData || !expenseData) return false;

  await createUserDate(userSeeder, userData);
  await createCategoryData(categorySeeder, categoryData);
  await createExpenseData(expenseSeeder, expenseData);

  return true;

  async function createUserDate(seeder: UserAttributes[], data: any[]) {
    if (seeder && data && seeder.length !== data.length) {
      const createData = [];
      for (const key in seeder) {
        if (seeder.hasOwnProperty(key)) {
          const detail = seeder[key];
          const isFound = data.find((v) => v["id"] === detail["id"]);
          if (!isFound) {
            createData.push(detail);
          }
        }
      }
      if (createData.length) {
        await userService.createManyUser(createData);
      }
    }
  }
  async function createCategoryData(seeder: CategoryAttributes[], data: any[]) {
    if (seeder && data && seeder.length !== data.length) {
      const createData = [];
      for (const key in seeder) {
        if (seeder.hasOwnProperty(key)) {
          const detail = seeder[key];
          const isFound = data.find((v) => v["id"] === detail["id"]);
          if (!isFound) {
            createData.push(detail);
          }
        }
      }
      if (createData.length) {
        await categoryService.createManyCategory(createData);
      }
    }
  }
  async function createExpenseData(seeder: ExpenseAttributes[], data: any[]) {
    if (seeder && data && seeder.length !== data.length) {
      const createData = [];
      for (const key in seeder) {
        if (seeder.hasOwnProperty(key)) {
          const detail = seeder[key];
          const isFound = data.find((v) => v["id"] === detail["id"]);
          if (!isFound) {
            createData.push(detail);
          }
        }
      }
      if (createData.length) {
        await expenseService.createManyExpense(createData);
      }
    }
  }
};
