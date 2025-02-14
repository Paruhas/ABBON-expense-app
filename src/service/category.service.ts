import Category from "../model/Category.model";
import { CategoryAttributes } from "../type/category.type";
import { consoleLog } from "../util/consoleLog";

export const categoryService = {
  findOneCategory: async (
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Category.findOne({ where: where, ...options });
    } catch (error) {
      consoleLog("Error categoryService.findOneCategory:", error);

      return 0;
    }
  },

  findAllCategory: async (
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Category.findAll({ where: where, ...options });
    } catch (error) {
      consoleLog("Error categoryService.findAllCategory:", error);

      return 0;
    }
  },

  createCategory: async (
    data: CategoryAttributes,
    options?: Record<string, any>
  ) => {
    try {
      return await Category.create(data, options);
    } catch (error) {
      consoleLog("Error categoryService.createCategory:", error);

      return 0;
    }
  },

  updateCategory: async (
    data: CategoryAttributes,
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await Category.update(data, { where: where, ...options });
    } catch (error) {
      consoleLog("Error categoryService.updateCategory:", error);

      return 0;
    }
  },
};
