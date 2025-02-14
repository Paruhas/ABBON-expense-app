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
} from "sequelize-typescript";
import Expense from "./Expense.model";
import { UserAttributes } from "../type/user.type";

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

@Scopes(() => ({
  defaultScope: {
    where: { db_status: "active" },
    attributes: {
      exclude: ["db_status"],
    },
  },
}))
@Table({
  timestamps: true,
  tableName: "users",
  modelName: "User",
})
export default class User extends Model<
  UserAttributes,
  UserCreationAttributes
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
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare hash_password: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare refresh_token: string;

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
    foreignKey: "user_id",
    as: "expense_list",
  })
  declare expense_list: ReturnType<() => Expense[]>;
}
