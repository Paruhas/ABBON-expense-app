import { readFileSync } from "fs";
import { Request, Response, NextFunction } from "express";

const homePage = readFileSync("./public/home.html", "utf8");

import { consoleLog } from "../util/consoleLog";

export const homeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send(homePage);
  } catch (error) {
    consoleLog("Error homeMiddleware:", error);

    next(error);
  }
};
