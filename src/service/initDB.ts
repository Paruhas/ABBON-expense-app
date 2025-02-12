import sequelize from "../model";

export const initDB = async (forceMode: boolean) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: forceMode });
  } catch (error) {
    console.log("Error initDB: ", error);
    return false;
  }
};
