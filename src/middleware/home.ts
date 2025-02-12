import { readFileSync } from "fs";
const homePage = readFileSync("./public/home.html", "utf8");
import { NextFunction, Request, Response } from "express";

export const homeMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.send(homePage);
  } catch (error) {
    next(error);
  }
};
