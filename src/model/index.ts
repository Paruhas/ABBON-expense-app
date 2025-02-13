import { Sequelize } from "sequelize-typescript";
import User from "./User.model";
import Expense from "./Expense.model";
import Category from "./Category.model";

const sequelize = new Sequelize({
  dialect: process.env.DB_TYPE as
    | "mysql"
    | "postgres"
    | "sqlite"
    | "mariadb"
    | "mssql",
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  models: [__dirname + "/*.model.ts"],
  // OPTIONS
  logging:
    process.env.DB_LOGGING === "true"
      ? (msg) => {
          console.log(`[Sequelize]: ${msg}`);
        }
      : false,
});

sequelize.addModels([User, Expense, Category]);

export default sequelize;
