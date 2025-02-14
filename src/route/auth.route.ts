import express from "express";
import { apiKeyAuthentication } from "../middleware/auth.middleware";
import {
  validateUserRegister,
  validateUserLogin,
} from "../middleware/user.middleware";
import { userLogin, userRegister } from "../controller/user.controller";
const authRoute = express.Router();

authRoute.post(
  "/register",
  apiKeyAuthentication,
  validateUserRegister,
  userRegister
);
authRoute.post("/login", apiKeyAuthentication, validateUserLogin, userLogin);

export default authRoute;
