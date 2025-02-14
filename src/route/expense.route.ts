import express from "express";

import {
  apiKeyAuthentication,
  validateUserToken,
} from "../middleware/auth.middleware";
import {
  addExpenseValidate,
  getAllExpenseValidate,
} from "../middleware/expense.middleware";
import { getAllExpense, addExpense } from "../controller/expense.controller";

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
expenseRoute.put("/:id", apiKeyAuthentication, validateUserToken);
expenseRoute.delete("/:id", apiKeyAuthentication, validateUserToken);

export default expenseRoute;
