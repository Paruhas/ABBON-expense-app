import { Request, Response, NextFunction } from "express";

import sequelize from "../model";
import { encodeJwt } from "../lib/jwt";
import { userService } from "../service/user.service";
import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";

export const refreshToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { user } = req;
    if (!user) throw new CustomError("3005", {});

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
      responseFormat("0000", "success", "Refresh success.", {
        id: user.id,
        email: user.email,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    consoleLog("Error refreshToken:", error);
    await transaction.rollback();

    next(error);
  }
};
