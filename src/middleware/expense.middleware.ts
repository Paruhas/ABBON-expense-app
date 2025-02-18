import { Request, Response, NextFunction } from "express";
import { Value } from "@sinclair/typebox/value";

import dayjs from "../lib/dayjsExtended";
import { categoryService } from "../service/category.service";
import { expenseService } from "../service/expense.service";
import {
  TypeBox_addExpense,
  TypeBox_deleteExpense,
  TypeBox_editExpense,
  TypeBox_getAllExpense,
} from "../type/expense.type";
import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import { regexValidateUUID } from "../util/regexValidate";

export const getAllExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, category_id, start, end, sort } = req.query;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    let errorArray: Record<string, string>[] = [];

    const isValid_query = Value.Check(TypeBox_getAllExpense.query, req.query);
    if (!isValid_query) {
      const errors = [...Value.Errors(TypeBox_getAllExpense.query, req.query)];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }

    const parseQuery = {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      start: Number(req.query.start),
      end: Number(req.query.end),
    };

    if (isNaN(parseQuery.page) || parseQuery.page < 1) {
      errorArray.push({
        params: "page",
        error: "Must be string of number and greater than zero.",
      });
    }
    if (isNaN(parseQuery.limit) || parseQuery.limit < 1) {
      errorArray.push({
        params: "limit",
        error: "Must be string of number and greater than zero.",
      });
    }
    if (category_id && !regexValidateUUID(category_id as string)) {
      errorArray.push({
        params: "category_id",
        error: "Must be string of UUID.",
      });
    }
    if (
      start &&
      (isNaN(parseQuery.start) || !dayjs(parseQuery.start).isValid())
    ) {
      errorArray.push({
        params: "start",
        error: "Must be string of number as date unix millisecond format.",
      });
    }
    if (end && (isNaN(parseQuery.end) || !dayjs(parseQuery.end).isValid())) {
      errorArray.push({
        params: "end",
        error: "Must be string of number as date unix millisecond format.",
      });
    }
    if (start && end && parseQuery.start > parseQuery.end) {
      errorArray.push(
        {
          params: "start",
          error:
            "Must be string of number as date unix millisecond format and less than end.",
        },
        {
          params: "end",
          error:
            "Must be string of number as date unix millisecond format and greater than start.",
        }
      );
    }
    if (sort && typeof sort === "string") {
      const orderArray: any[] = [];
      const sortArray = sort.split(",");

      for (let x = 0; x < sortArray.length; x++) {
        const dX = sortArray[x];

        if (dX.startsWith("+") || dX.startsWith("-")) {
          orderArray.push([
            dX.replace(/[+-]/g, "").trim(),
            dX.startsWith("+") ? "ASC" : "DESC",
          ]);
        }
      }

      if (!orderArray.length) {
        errorArray.push({
          params: "sort",
          error:
            "Format must be %2Bfield or -field and separated by comma (example : %2Bid,-title for id ASC and title DESC).",
        });
      }
      req.query.order = orderArray;
    }

    if (errorArray.length > 0) {
      throw new CustomError("2001", errorArray);
    }

    if (category_id) {
      const category = await categoryService.findOneCategory({
        id: category_id,
        user_id: user.id,
      });
      if (category === 0) throw new CustomError("4001", {});
      if (!category) throw new CustomError("3006", {});
    }

    next();
  } catch (error) {
    consoleLog("Error getAllExpenseValidate:", error);

    next(error);
  }
};

export const addExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, amount, date, note, category_id } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    let errorArray: Record<string, string>[] = [];

    const isValid_body = Value.Check(TypeBox_addExpense.body, req.body);
    if (!isValid_body) {
      const errors = [...Value.Errors(TypeBox_addExpense.body, req.body)];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }

    const parseAmount = {
      integer: amount.toString().split(".")[0],
      decimal: amount.toString().split(".")[1] || "",
    };
    if (
      amount <= 0 ||
      parseAmount.integer.length > 8 ||
      parseAmount.decimal.length > 2
    ) {
      errorArray.push({
        params: "amount",
        error: "Must be number as decimal(10,2) and greater than zero.",
      });
    }

    if (errorArray.length > 0) {
      throw new CustomError("2001", errorArray);
    }

    const category = await categoryService.findOneCategory({
      id: category_id,
      user_id: user.id,
    });
    if (category === 0) throw new CustomError("4001", {});
    if (!category) throw new CustomError("3006", {});

    req.category = category;

    next();
  } catch (error) {
    consoleLog("Error addExpenseValidate:", error);

    next(error);
  }
};

export const editExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, amount, date, note, category_id } = req.body;
    const { id } = req.params;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    let errorArray: Record<string, string>[] = [];

    if (!Value.Check(TypeBox_editExpense.body, req.body)) {
      const errors = [...Value.Errors(TypeBox_addExpense.body, req.body)];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }
    if (!Value.Check(TypeBox_editExpense.params, req.params)) {
      const errors = [...Value.Errors(TypeBox_editExpense.params, req.params)];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }

    const parseAmount = {
      integer: amount.toString().split(".")[0],
      decimal: amount.toString().split(".")[1] || "",
    };
    if (
      amount <= 0 ||
      parseAmount.integer.length > 8 ||
      parseAmount.decimal.length > 2
    ) {
      errorArray.push({
        params: "amount",
        error: "Must be number as decimal(10,2) and greater than zero.",
      });
    }

    if (category_id && !regexValidateUUID(category_id as string)) {
      errorArray.push({
        params: "category_id",
        error: "Must be string of UUID.",
      });
    }
    if (id && !regexValidateUUID(id as string)) {
      errorArray.push({
        params: "id",
        error: "Must be string of UUID.",
      });
    }

    if (errorArray.length > 0) {
      throw new CustomError("2001", errorArray);
    }

    const [categoryData, expenseData] = await Promise.all([
      categoryService.findOneCategory({ id: category_id, user_id: user.id }),
      expenseService.findOneExpense({ id: id, user_id: user.id }),
    ]);
    if (categoryData === 0 || expenseData === 0)
      throw new CustomError("4001", {});
    if (!categoryData) throw new CustomError("3006", {});
    if (!expenseData) throw new CustomError("3007", {});

    req.category = categoryData;
    req.expense = expenseData;

    next();
  } catch (error) {
    consoleLog("Error editExpenseValidate:", error);

    next(error);
  }
};

export const deleteExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    let errorArray: Record<string, string>[] = [];

    if (!Value.Check(TypeBox_deleteExpense.params, req.params)) {
      const errors = [
        ...Value.Errors(TypeBox_deleteExpense.params, req.params),
      ];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }

    if (id && !regexValidateUUID(id as string)) {
      errorArray.push({
        params: "id",
        error: "Must be string of UUID.",
      });
    }

    if (errorArray.length > 0) {
      throw new CustomError("2001", errorArray);
    }

    const expenseData = await expenseService.findOneExpense({
      id: id,
      user_id: user.id,
    });
    if (expenseData === 0) throw new CustomError("4001", {});
    if (!expenseData) throw new CustomError("3007", {});

    req.expense = expenseData;

    next();
  } catch (error) {
    consoleLog("Error deleteExpenseValidate:", error);

    next(error);
  }
};
