import express from "express";

import {
  apiKeyAuthentication,
  validateUserToken,
} from "../middleware/auth.middleware";
import {
  addExpenseValidate,
  getAllExpenseValidate,
  editExpenseValidate,
  deleteExpenseValidate,
} from "../middleware/expense.middleware";
import {
  getAllExpense,
  addExpense,
  editExpense,
  deleteExpense,
} from "../controller/expense.controller";

const expenseRoute = express.Router();

expenseRoute.get(
  "/",
  apiKeyAuthentication,
  validateUserToken,
  getAllExpenseValidate,
  getAllExpense
);
expenseRoute.post(
  "/",
  apiKeyAuthentication,
  validateUserToken,
  addExpenseValidate,
  addExpense
);
expenseRoute.put(
  "/:id",
  apiKeyAuthentication,
  validateUserToken,
  editExpenseValidate,
  editExpense
);
expenseRoute.delete(
  "/:id",
  apiKeyAuthentication,
  validateUserToken,
  deleteExpenseValidate,
  deleteExpense
);

export default expenseRoute;
