import e, { Request, Response, NextFunction } from "express";

import sequelize from "../model";
import { categoryService } from "../service/category.service";
import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";
import { expenseService } from "../service/expense.service";
import Category from "../model/Category.model";
import { Op } from "sequelize";

export const getAllExpense = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, category_id, start, end } = req.query;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const offset: number = (Number(page) - 1) * Number(limit);

    const wherePayload: Record<string, any> = {
      user_id: user.id as string,
    };
    if (category_id) wherePayload.category_id = category_id as string;
    switch (true) {
      case Boolean(start) && !Boolean(end):
        wherePayload.date = { [Op.gte]: Number(start) };
        break;

      case !Boolean(start) && Boolean(end):
        wherePayload.date = { [Op.lte]: Number(end) };
        break;

      case Boolean(start) && Boolean(end):
        wherePayload.date = { [Op.gte]: Number(start), [Op.lte]: Number(end) };
        break;

      default:
        break;
    }

    const expenseData = await expenseService.findAllExpensePagination(
      wherePayload,
      Number(limit),
      offset,
      { include: [{ model: Category, as: "category_data" }] }
    );
    if (!expenseData) throw new CustomError("4001", {});

    res
      .status(200)
      .json(
        responseFormat("0000", "success", "Get data success.", expenseData)
      );
  } catch (error) {
    consoleLog("Error getAllExpense:", error);

    next(error);
  }
};

export const addExpense = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, amount, date, note, category_id } = req.body;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    const { category } = req;
    if (!category) throw new CustomError("3006", {});

    const createNewExpense = await expenseService.createExpense(
      {
        title,
        amount,
        date,
        note,
        category_id: category.id as string,
        user_id: user.id as string,
      },
      { transaction: transaction }
    );
    if (!createNewExpense) throw new CustomError("4002", {});

    await transaction.commit();

    res.status(200).json(
      responseFormat("0000", "success", "Post data success.", {
        id: createNewExpense.id,
        title: createNewExpense.title,
        amount: createNewExpense.amount,
        date: createNewExpense.date,
        note: createNewExpense.note,
        category_id: createNewExpense.category_id,
        user_id: createNewExpense.user_id,
      })
    );
  } catch (error) {
    consoleLog("Error addExpense:", error);
    await transaction.rollback();

    next(error);
  }
};
