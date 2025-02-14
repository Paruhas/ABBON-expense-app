import { Request, Response, NextFunction } from "express";
import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { userService } from "../service/user.service";
import { ExtendedRequest } from "../type/req,type";
import { TypeBox_UserRegister } from "../type/user.type";
import { CustomError } from "../util/customError";
import { regexValidateEmail } from "../util/regexValidate";

export const validateUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const isValid = Value.Check(TypeBox_UserRegister.body, req.body);
    if (!isValid) {
      const errors = [...Value.Errors(TypeBox_UserRegister.body, req.body)];
      console.log("errors", errors);
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

    const isValidEmail = regexValidateEmail(email);
    if (!isValidEmail) throw new CustomError("2002", ["email"]);

    const usernameExists = await userService.findOneUser({ email: email });
    if (usernameExists === 0) throw new CustomError("4001", {});
    if (usernameExists) throw new CustomError("3001", ["email"]);

    next();
  } catch (error) {
    next(error);
  }
};

export const validateUserLogin = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const isValid = Value.Check(TypeBox_UserRegister.body, req.body);
    if (!isValid) {
      const errors = [...Value.Errors(TypeBox_UserRegister.body, req.body)];
      console.log("errors", errors);
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

    const isValidEmail = regexValidateEmail(email);
    if (!isValidEmail) throw new CustomError("2002", ["email"]);

    const userData = await userService.findOneUser(
      { email: email },
      { raw: true }
    );
    if (!userData) throw new CustomError("4001", {});

    req.user = userData;

    next();
  } catch (error) {
    next(error);
  }
};
