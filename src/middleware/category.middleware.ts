import { NextFunction, Request, Response } from "express";
import { Value } from "@sinclair/typebox/value";

import { categoryService } from "../service/category.service";
import {
  TypeBox_addCategory,
  TypeBox_editCategory,
} from "../type/category.type";
import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";

export const addCategoryValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const isValid = Value.Check(TypeBox_addCategory.body, req.body);
    if (!isValid) {
      const errors = [...Value.Errors(TypeBox_addCategory.body, req.body)];
      let errorArray: any[] = [];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }

      throw new CustomError("2001", errorArray);
    }

    const categoryExists = await categoryService.findOneCategory({
      name: name,
      user_id: user.id,
    });
    if (categoryExists === 0) throw new CustomError("4001", {});
    if (categoryExists) throw new CustomError("3001", ["name"]);

    next();
  } catch (error) {
    consoleLog("Error addCategoryValidate:", error);

    next(error);
  }
};

export const editCategoryValidate = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const isValid_body = Value.Check(TypeBox_editCategory.body, req.body);
    if (!isValid_body) {
      const errors = [...Value.Errors(TypeBox_editCategory.body, req.body)];
      let errorArray: any[] = [];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }

      throw new CustomError("2001", errorArray);
    }

    const isValid_params = Value.Check(TypeBox_editCategory.params, req.params);
    if (!isValid_params) {
      const errors = [...Value.Errors(TypeBox_editCategory.params, req.params)];
      let errorArray: any[] = [];

      for (let x = 0; x < errors.length; x++) {
        const dX = errors[x];

        errorArray.push({
          params: dX.path.split("/")[1],
          error: dX.message,
        });
      }

      throw new CustomError("2001", errorArray);
    }

    const [categoryExists, category] = await Promise.all([
      categoryService.findOneCategory({ name: name, user_id: user.id }),
      categoryService.findOneCategory({ id: id, user_id: user.id }),
    ]);
    if (categoryExists === 0) throw new CustomError("4001", {});
    if (categoryExists) throw new CustomError("3001", ["name"]);
    if (!category) throw new CustomError("4001", {});

    req.category = category;

    next();
  } catch (error) {
    consoleLog("Error editCategoryValidate:", error);

    next(error);
  }
};
