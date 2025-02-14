import express from "express";

import {
  addCategory,
  editCategory,
  getAllCategory,
} from "../controller/category.controller";
import {
  apiKeyAuthentication,
  validateUserToken,
} from "../middleware/auth.middleware";
import {
  addCategoryValidate,
  editCategoryValidate,
} from "../middleware/category.middleware";

const categoryRoute = express.Router();

categoryRoute.get("/", apiKeyAuthentication, validateUserToken, getAllCategory);
categoryRoute.post(
  "/",
  apiKeyAuthentication,
  validateUserToken,
  addCategoryValidate,
  addCategory
);
categoryRoute.put(
  "/:id",
  apiKeyAuthentication,
  validateUserToken,
  editCategoryValidate,
  editCategory
);

export default categoryRoute;
