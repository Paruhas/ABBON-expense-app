import express, { NextFunction, Request, Response } from "express";
import {
  userRegister,
  validateUserRegister,
} from "../middleware/user.middleware";
const userRouter = express.Router();

userRouter.get("/", () => {});
userRouter.post("/register", validateUserRegister, userRegister);
userRouter.post("/login", () => {});

export default userRouter;
