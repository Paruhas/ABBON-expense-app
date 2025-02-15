import express from "express";

import {
  apiKeyAuthentication,
  validateUserToken,
} from "../middleware/auth.middleware";
import { reportExpenseValidate } from "../middleware/report.middleware";
import { reportExpense } from "../controller/report.controller";

const reportRoute = express.Router();

reportRoute.get(
  "/expense",
  apiKeyAuthentication,
  validateUserToken,
  reportExpenseValidate,
  reportExpense
);

export default reportRoute;
