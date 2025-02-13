import express from "express";
import {
  userRegister,
  validateUserRegister,
} from "../middleware/user.middleware";
const authRoute = express.Router();

authRoute.post("/register", validateUserRegister, userRegister);
authRoute.post("/login", () => {});

export default authRoute;
