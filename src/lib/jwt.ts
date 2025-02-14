import jwt from "jsonwebtoken";
import ms from "ms";
import { consoleLog } from "../util/consoleLog";

export const encodeJwt = (
  data: Record<string, any>,
  type: "access" | "refresh"
) => {
  try {
    const value: Record<string, any> = {
      secret: "",
      expire: "",
    };

    switch (true) {
      case type === "access":
        value.secret = process.env.ACCESS_TOKEN_SECRET_KEY;
        value.expire = process.env.ACCESS_TOKEN_EXPIRATION;
        break;

      case type === "refresh":
        value.secret = process.env.REFRESH_TOKEN_SECRET_KEY;
        value.expire = process.env.REFRESH_TOKEN_EXPIRATION;
        break;

      default:
        break;
    }

    if (!value.secret || value.secret === "") {
      throw new Error(
        `Missing ${
          type === "access"
            ? "ACCESS_TOKEN_SECRET_KEY"
            : "REFRESH_TOKEN_SECRET_KEY"
        } in environment variables`
      );
    }
    if (!value.expire || value.expire === "") {
      throw new Error(
        `Missing ${
          type === "access"
            ? "ACCESS_TOKEN_EXPIRATION"
            : "REFRESH_TOKEN_EXPIRATION"
        } in environment variables`
      );
    }

    const token = jwt.sign(data, value.secret, {
      expiresIn: value.expire as ms.StringValue,
    });

    return token;
  } catch (error) {
    consoleLog("Error encodeJwt:", error);

    return 0;
  }
};

export const decodeJwt = (token: string, type: "access" | "refresh") => {
  try {
    const value: Record<string, any> = {
      secret: "",
    };

    switch (true) {
      case type === "access":
        value.secret = process.env.ACCESS_TOKEN_SECRET_KEY;
        break;

      case type === "refresh":
        value.secret = process.env.REFRESH_TOKEN_SECRET_KEY;
        break;

      default:
        break;
    }

    if (!value.secret || value.secret === "") {
      throw new Error(
        `Missing ${
          type === "access"
            ? "ACCESS_TOKEN_SECRET_KEY"
            : "REFRESH_TOKEN_SECRET_KEY"
        } in environment variables`
      );
    }

    const data = jwt.verify(token, value.secret);

    return data;
  } catch (error) {
    consoleLog("Error decodeJwt:", error);

    return 0;
  }
};
