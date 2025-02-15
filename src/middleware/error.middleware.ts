import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";

const ERRORS = require("../seeder/errors.json");

export const errorMiddleware: ErrorRequestHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let httpCode = 400;
  let resCode = "9999";
  let resData = {};
  let resMessage = "No message found.";

  if (err instanceof CustomError) {
    const errorDetail = ERRORS[err.message];
    if (errorDetail) {
      httpCode = errorDetail.httpCode;
      resMessage = errorDetail.resMessage;

      resCode = err.message;
      resData = err.resData;
    }
  }

  const resError = responseFormat(resCode, "error", resMessage, resData);

  res.status(httpCode).json(resError);
};

export const pathErrorMiddleware = (req: Request, res: Response) => {
  res.status(404).json(responseFormat("9999", "error", "Path not found.", {}));
};
