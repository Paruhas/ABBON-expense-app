import { NextFunction, Request, Response } from "express";
import responseFormat from "../util/responseFormat";
import { Type, Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { CustomError } from "../util/customError";

const RegisterType = {
  body: Type.Object({
    username: Type.String({ minLength: 3, maxLength: 20 }),
    password: Type.String({ minLength: 6 }),
  }),
};

export const validateUserRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;
    const isValid = Value.Check(RegisterType.body, req.body);

    if (!isValid) {
      const errors = [...Value.Errors(RegisterType.body, req.body)];
      let errorArray: any[] = [];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }

      throw new CustomError("2001", errorArray);
    }

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
