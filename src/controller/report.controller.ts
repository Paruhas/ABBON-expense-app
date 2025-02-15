import { Request, Response, NextFunction } from "express";

import { ExtendedRequest } from "../type/req.type";
import { consoleLog } from "../util/consoleLog";
import { CustomError } from "../util/customError";
import responseFormat from "../util/responseFormat";
import { expenseService } from "../service/expense.service";
import Category from "../model/Category.model";
import { Op, Sequelize } from "sequelize";

export const reportExpense = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { start, end } = req.query;

    const { user } = req;
    if (!user) throw new CustomError("3005", {});

    // const report = await expenseService.findAllExpense({
    //   user_id: user.id as string,
    //   date: { [Op.gte]: Number(start), [Op.lte]: Number(end) },
    // });
    const report = await expenseService.findAllExpense(
      {
        user_id: user.id as string,
        date: { [Op.gte]: Number(start), [Op.lte]: Number(end) },
      },
      {
        attributes: [
          "category_id",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "amount"],
        ],
        include: [
          { model: Category, as: "category_data", attributes: ["name"] },
        ],
        group: ["category_id"],
      }
    );
    if (!report) throw new CustomError("4001", {});

    res
      .status(200)
      .json(responseFormat("0000", "success", "Get data success.", report));
  } catch (error) {
    consoleLog("Error reportExpense:", error);

    next(error);
  }
};
