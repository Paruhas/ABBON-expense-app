import dayjs from "../lib/dayjsExtended";
import { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[${dayjs().utc().format()}] ${req.method} ${req.url}`);
  next(); // Pass control to the next middleware or route handler
};
