import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";

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

      case "2002":
        httpCode = 400;
        resCode = "2002";
        resData = err.resData;
        resMessage = "Invalid format.";
        break;

      case "3001":
        httpCode = 400;
        resCode = "3001";
        resData = err.resData;
        resMessage = "Duplicate data.";
        break;

      case "3011":
        httpCode = 400;
        resCode = "3011";
        resData = err.resData;
        resMessage = "Register fail.";
        break;

      case "3021":
        httpCode = 400;
        resCode = "3021";
        resData = err.resData;
        resMessage = "Login fail.";
        break;

      case "3031":
        httpCode = 400;
        resCode = "3031";
        resData = err.resData;
        resMessage = "Refresh fail.";
        break;

      case "4001":
        httpCode = 400;
        resCode = "4001";
        resData = err.resData;
        resMessage = "GET data fail.";
        break;

      case "4002":
        httpCode = 400;
        resCode = "4002";
        resData = err.resData;
        resMessage = "POST data fail.";
        break;

      case "4003":
        httpCode = 400;
        resCode = "4003";
        resData = err.resData;
        resMessage = "PUT data fail.";
        break;

      case "4004":
        httpCode = 400;
        resCode = "4004";
        resData = err.resData;
        resMessage = "DELETE data fail.";
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
