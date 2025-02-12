import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import responseFormat from "../util/responseFormat";

export const errorMiddleware: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("first");
  let resHTTPCode = 400;

  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    resHTTPCode = 401; // ดัก Error จากการ Auth Token
  }
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    resHTTPCode = 400;
  }

  const resError = responseFormat("9999", "error", err.message, {});

  res.status(resHTTPCode).json(resError);
};

export const pathErrorMiddleware = (req: Request, res: Response) => {
  res.status(404).json(responseFormat("9999", "error", "Path not found.", {}));
};
