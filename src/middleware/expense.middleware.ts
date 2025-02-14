import { NextFunction, Request, Response } from "express";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { JwtPayload } from "jsonwebtoken";

import { decodeJwt } from "../lib/jwt";
import { ExtendedRequest } from "../type/req.type";
import { userService } from "../service/user.service";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import { regexValidateUUID } from "../util/regexValidate";
import dayjs from "../lib/dayjsExtended";
import {
  TypeBox_addExpense,
  TypeBox_getAllExpense,
} from "../type/expense.type";
import { categoryService } from "../service/category.service";

export const getAllExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, category_id, start, end } = req.query;

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
