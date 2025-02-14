import { NextFunction, Request, Response } from "express";
import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { JwtPayload } from "jsonwebtoken";

import { decodeJwt } from "../lib/jwt";
import { ExtendedRequest } from "../type/req.type";
import { userService } from "../service/user.service";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";

export const apiKeyAuthentication = async (
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
    consoleLog("Error apiKeyAuthentication:", error);

    next(error);
  }
};

export const validateUserToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new CustomError("1002", {});

    const token = authorization.replace("Bearer ", "");
    const data = decodeJwt(token, "access");
    if (!data) throw new CustomError("1003", {}); // expected error bcz token expired

    const { id } = data as JwtPayload;
    if (!id) throw new CustomError("1003", {}); // expected error bcz token expired

    const userData = await userService.findOneUser({ id: id }, { raw: true });
    if (!userData) throw new CustomError("4001", {});

    req.user = userData;

    next();
  } catch (error) {
    consoleLog("Error validateUserToken:", error);

    next(error);
  }
};

export const validateRefreshToken = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = Value.Check(Type.String(), req.headers["x-refresh-token"]);

    if (!isValid) {
      throw new CustomError("1004", {});
    }
    const token = req.headers["x-refresh-token"] as unknown as string;

    const data = decodeJwt(token, "refresh");
    if (!data) throw new CustomError("1004", {});

    const { id } = data as JwtPayload;
    if (!id) throw new CustomError("1004", {});

    const userData = await userService.findOneUser({ id: id }, { raw: true });
    if (!userData) throw new CustomError("4001", {});
    if (userData.refresh_token !== token) throw new CustomError("1004", {});

    req.user = userData;

    next();
  } catch (error) {
    consoleLog("Error validateRefreshToken:", error);

    next(error);
  }
};
