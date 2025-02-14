import User from "../model/User.model";
import { UserAttributes } from "../type/user.type";
import { consoleLog } from "../util/consoleLog";

export const userService = {
  findOneUser: async (
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await User.findOne({ where: where, ...options });
    } catch (error) {
      consoleLog("Error userService.findOneUser:", error);

      return 0;
    }
  },

  createUser: async (data: UserAttributes, options?: Record<string, any>) => {
    try {
      return await User.create(data, options);
    } catch (error) {
      consoleLog("Error userService.createUser:", error);

      return 0;
    }
  },

  updateUser: async (
    data: UserAttributes,
    where: Record<string, any>,
    options?: Record<string, any>
  ) => {
    try {
      return await User.update(data, { where: where, ...options });
    } catch (error) {
      consoleLog("Error userService.updateUser:", error);

      return 0;
    }
  },
};
