import { Request, Response, NextFunction } from "express";

import sequelize from "../model";
import { categoryService } from "../service/category.service";
import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";

export const getAllCategory = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const categories = await categoryService.findAllCategory(
      {
        user_id: user.id,
      },
      { attributes: { exclude: ["user_id"] } }
    );
    if (!categories) throw new CustomError("4001", {});

    res
      .status(200)
      .json(responseFormat("0000", "success", "Get data success.", categories));
  } catch (error) {
    consoleLog("Error getAllCategory:", error);

    next(error);
  }
};

export const addCategory = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { name } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const createNewCategories = await categoryService.createCategory(
      {
        name: name,
        user_id: user.id as string,
      },
      { transaction: transaction }
    );
    if (!createNewCategories) throw new CustomError("4002", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("0000", "success", "Post data success.", {
        id: createNewCategories.id,
        name: createNewCategories.name,
      })
    );
  } catch (error) {
    consoleLog("Error addCategory:", error);
    await transaction.rollback();

    next(error);
  }
};

export const editCategory = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { name } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});
    const { category } = req;
    if (!category) throw new CustomError("3006", {});

    const editCategory = await categoryService.updateCategory(
      {
        name: name,
        user_id: user.id as string,
      },
      { id: category.id, user_id: user.id },
      { transaction: transaction }
    );
    if (!editCategory) throw new CustomError("4002", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("0000", "success", "Put data success.", {
        id: category.id,
        name: name,
      })
    );
  } catch (error) {
    consoleLog("Error editCategory:", error);
    await transaction.rollback();

    next(error);
  }
};
