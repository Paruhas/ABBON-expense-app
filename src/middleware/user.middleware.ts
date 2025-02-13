import { NextFunction, Request, Response } from "express";
import responseFormat from "../util/responseFormat";

export const validateUserRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("validateUserRegister");

    next();
  } catch (error) {
    next(error);
  }
};

export const userRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("userRegister");

    res.status(200).json(responseFormat("0000", "success", "success", {}));
  } catch (error) {
    next(error);
  }
};
