import { Request, Response, NextFunction } from "express";

import sequelize from "../model";
import { generateHashPassword, passwordVerify } from "../lib/bcrypt";
import { encodeJwt } from "../lib/jwt";
import { ExtendedRequest } from "../type/req.type";
import { userService } from "../service/user.service";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";
import { categoryService } from "../service/category.service";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { email, password } = req.body;

    const hashPassword = await generateHashPassword(password);
    if (!hashPassword) throw new CustomError("3002", {});

    const createPayload = {
      email,
      hash_password: hashPassword,
      refresh_token: "",
    };
    const createNewUser = await userService.createUser(createPayload, {
      transaction: transaction,
    });
    if (!createNewUser) throw new CustomError("4002", {});

    const accessToken = encodeJwt({ id: createNewUser.id, email }, "access");
    const refreshToken = encodeJwt({ id: createNewUser.id, email }, "refresh");
    if (!accessToken || !refreshToken) throw new CustomError("3002", {});

    const updateUser = await userService.updateUser(
      { ...createPayload, refresh_token: refreshToken },
      { id: createNewUser.id },
      { transaction: transaction }
    );
    if (!updateUser) throw new CustomError("3002", {});

    const addDefaultCategory = await categoryService.createManyCategory(
      [
        { name: "Food", user_id: createNewUser.id },
        { name: "Transportation", user_id: createNewUser.id },
      ],
      { transaction: transaction }
    );
    if (!addDefaultCategory) throw new CustomError("4002", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("0000", "success", "Register success.", {
        id: createNewUser.id,
        email,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    consoleLog("Error userRegister:", error);
    await transaction.rollback();

    next(error);
  }
};

export const userLogin = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { password } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const isPasswordMatched = passwordVerify(password, user.hash_password);
    if (!isPasswordMatched) throw new CustomError("3003", {});

    const accessToken = encodeJwt({ id: user.id, email: user.email }, "access");
    const refreshToken = encodeJwt(
      { id: user.id, email: user.email },
      "refresh"
    );
    if (!accessToken || !refreshToken) throw new CustomError("3003", {});

    const updateUser = await userService.updateUser(
      {
        email: user.email,
        hash_password: user.hash_password,
        refresh_token: refreshToken,
      },
      { id: user.id },
      { transaction: transaction }
    );
    if (!updateUser) throw new CustomError("3003", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("0000", "success", "Login success.", {
        id: user.id,
        email: user.email,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    consoleLog("Error userLogin:", error);
    await transaction.rollback();

    next(error);
  }
};

export const userProfile = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    res.status(200).json(
      responseFormat("0000", "success", "Get data success.", {
        id: user.id,
        email: user.email,
      })
    );
  } catch (error) {
    consoleLog("Error userLogin:", error);

    next(error);
  }
};
