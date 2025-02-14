import { Type, type Static } from "@sinclair/typebox";

export interface CategoryAttributes {
  id?: string;
  name: string;
  db_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  // FK
  user_id: string;
}

export const TypeBox_addCategory = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
  }),
};

export const TypeBox_editCategory = {
  body: Type.Object({
    name: Type.String({ minLength: 1, maxLength: 100 }),
  }),

  params: Type.Object({
    id: Type.String({ minLength: 5, maxLength: 50 }),
  }),
};
