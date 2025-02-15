import { Request, Response, NextFunction } from "express";
import { Value } from "@sinclair/typebox/value";

import dayjs from "../lib/dayjsExtended";
import { ExtendedRequest } from "../type/req.type";
import { TypeBox_getReportExpense } from "../type/report.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";

export const reportExpenseValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = req.query;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    let errorArray: Record<string, string>[] = [];

    const isValid_query = Value.Check(
      TypeBox_getReportExpense.query,
      req.query
    );
    if (!isValid_query) {
      const errors = [
        ...Value.Errors(TypeBox_getReportExpense.query, req.query),
      ];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }
    }

    const parseQuery = {
      start: Number(req.query.start),
      end: Number(req.query.end),
    };
    if (isNaN(parseQuery.start) || !dayjs(parseQuery.start).isValid()) {
      errorArray.push({
        params: "start",
        error: "Must be string of number as date unix millisecond format.",
      });
    }
    if (isNaN(parseQuery.end) || !dayjs(parseQuery.end).isValid()) {
      errorArray.push({
        params: "end",
        error: "Must be string of number as date unix millisecond format.",
      });
    }
    if (parseQuery.start > parseQuery.end) {
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

    next();
  } catch (error) {
    consoleLog("Error reportExpenseValidate:", error);

    next(error);
  }
};
