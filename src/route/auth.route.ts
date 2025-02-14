import express from "express";

import {
  apiKeyAuthentication,
  validateRefreshToken,
} from "../middleware/auth.middleware";
import {
  validateUserRegister,
  validateUserLogin,
} from "../middleware/user.middleware";
import { refreshToken } from "../controller/auth.controller";
import { userLogin, userRegister } from "../controller/user.controller";

const authRoute = express.Router();

authRoute.post(
  "/register",
  apiKeyAuthentication,
  validateUserRegister,
  userRegister
);
authRoute.post("/login", apiKeyAuthentication, validateUserLogin, userLogin);
authRoute.post(
  "/refresh",
  apiKeyAuthentication,
  validateRefreshToken,
  refreshToken
);

export default authRoute;
