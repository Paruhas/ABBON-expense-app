import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  Scopes,
  BelongsTo,
} from "sequelize-typescript";
import User from "./User.model";
import Category from "./Category.model";
import { ExpenseAttributes } from "../type/expense.type";

interface ExpenseCreationAttributes extends Optional<ExpenseAttributes, "id"> {}

@Scopes(() => ({
  defaultScope: {
    where: { db_status: "active" },
    attributes: {
      exclude: ["db_status", "created_at", "updated_at"],
    },
  },
}))
@Table({
  timestamps: true,
  tableName: "expenses",
  modelName: "Expense",
})
export default class Expense extends Model<
  ExpenseAttributes,
  ExpenseCreationAttributes
> {
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare amount: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare date: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  declare note: string | null;

  @Column({
    type: DataType.ENUM("active", "inactive"),
    allowNull: false,
    defaultValue: "active",
  })
  declare db_status: "active" | "inactive";

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  // Define association
  @BelongsTo(() => User, {
    targetKey: "id",
    foreignKey: { name: "user_id", allowNull: false },
    as: "user_data",
  })
  declare user_id: string;

  @BelongsTo(() => Category, {
    targetKey: "id",
    foreignKey: { name: "category_id", allowNull: false },
    as: "category_data",
  })
  declare category_id: string;
}
