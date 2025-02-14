import { Type, type Static } from "@sinclair/typebox";

export interface UserAttributes {
  id?: string;
  email: string;
  hash_password: string;
  refresh_token: string;
  db_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export const TypeBox_UserRegister = {
  body: Type.Object({
    email: Type.String({ minLength: 8, maxLength: 100 }),
    password: Type.String({ minLength: 8, maxLength: 32 }),
  }),
};
