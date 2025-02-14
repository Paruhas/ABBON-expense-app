import { Request, Response, NextFunction } from "express";
import { generateHashPassword } from "../lib/bcrypt";
import { userService } from "../service/user.service";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";
import { encodeJwt } from "../lib/jwt";
import sequelize from "../model";

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { email, password } = req.body;

    const hashPassword = await generateHashPassword(password);

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
    if (!accessToken || !refreshToken) throw new CustomError("4003", {});

    const updateUser = await userService.updateUser(
      { ...createPayload, refresh_token: refreshToken },
      { id: createNewUser.id },
      { transaction: transaction }
    );
    if (!updateUser) throw new CustomError("4003", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("2001", "success", "Register success.", {
        id: createNewUser.id,
        email,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    console.error("Error userRegister:", error);
    await transaction.rollback();

    next(error);
  }
};
