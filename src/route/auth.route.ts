import express from "express";
import { apiKeyAuthentication } from "../middleware/auth.middleware";
import { validateUserRegister } from "../middleware/user.middleware";
import { userRegister } from "../controller/user.controller";
const authRoute = express.Router();

authRoute.post(
  "/register",
  apiKeyAuthentication,
  validateUserRegister,
  userRegister
);
authRoute.post("/login", () => {});

export default authRoute;
