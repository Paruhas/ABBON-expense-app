import sequelize from "../model";

export const initDB = async (forceMode: boolean) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: forceMode });

    return true;
  } catch (error) {
    console.log("Error initDB: ", error);
    return false;
  }
};
