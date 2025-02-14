import { Optional } from "sequelize";
import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  Scopes,
  HasMany,
  BelongsTo,
} from "sequelize-typescript";
import Expense from "./Expense.model";
import { CategoryAttributes } from "../type/category.type";
import User from "./User.model";

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, "id"> {}

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
  tableName: "categories",
  modelName: "Category",
})
export default class Category extends Model<
  CategoryAttributes,
  CategoryCreationAttributes
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
  declare name: string;

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
  @HasMany(() => Expense, {
    sourceKey: "id",
    foreignKey: "category_id",
    as: "expense_list",
  })
  declare expense_list: ReturnType<() => Expense[]>;

  @BelongsTo(() => User, {
    targetKey: "id",
    foreignKey: { name: "user_id", allowNull: false },
    as: "user_data",
  })
  declare user_id: string;
}
