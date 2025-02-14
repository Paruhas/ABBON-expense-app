import sequelize from "../model";
import { consoleLog } from "../util/consoleLog";

export const initDB = async (forceMode: boolean) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: forceMode });

    return true;
  } catch (error) {
    consoleLog("Error initDB: ", error);

    return false;
  }
};
