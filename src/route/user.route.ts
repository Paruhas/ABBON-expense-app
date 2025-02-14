import express from "express";

import {
  apiKeyAuthentication,
  validateUserToken,
} from "../middleware/auth.middleware";
import { userProfile } from "../controller/user.controller";

const userRoute = express.Router();

userRoute.get("/profile", apiKeyAuthentication, validateUserToken, userProfile);

export default userRoute;
