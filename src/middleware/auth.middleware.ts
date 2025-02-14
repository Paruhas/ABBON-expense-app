import { NextFunction, Request, Response } from "express";
import responseFormat from "../util/responseFormat";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { CustomError } from "../util/customError";

export const apiKeyAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = Value.Check(Type.String(), req.headers["x-api-key"]);

    if (!isValid || req.headers["x-api-key"] !== process.env.API_KEY) {
      throw new CustomError("1001", {});
    }

    next();
  } catch (error) {
    next(error);
  }
};
