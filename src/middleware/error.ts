import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import responseFormat from "../util/responseFormat";
import { CustomError } from "../util/customError";

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

  console.log("err", err);

  // if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
  //   resCode = "1001";
  //   httpCode = 401;
  // }
  // if (
  //   err.name === "SequelizeValidationError" ||
  //   err.name === "SequelizeUniqueConstraintError"
  // ) {
  //   httpCode = 400;
  // }

  if (err instanceof CustomError) {
    switch (err.message) {
      case "1001":
        httpCode = 401;
        resCode = "1001";
        resMessage = "Invalid API key.";
        break;

      case "1002":
        httpCode = 401;
        resCode = "1002";
        resMessage = "Unauthorized, invalid Token.";
        break;

      case "1003":
        httpCode = 403;
        resCode = "1003";
        resMessage = "Forbidden, invalid Token.";
        break;

      case "2001":
        httpCode = 400;
        resCode = "2001";
        resData = err.resData;
        resMessage = "Validate error.";
        break;

      default:
        break;
    }
  }

  const resError = responseFormat(resCode, "error", resMessage, resData);

  res.status(httpCode).json(resError);
};

export const pathErrorMiddleware = (req: Request, res: Response) => {
  res.status(404).json(responseFormat("9999", "error", "Path not found.", {}));
};
