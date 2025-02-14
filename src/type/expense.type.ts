import { Type, type Static } from "@sinclair/typebox";

export interface ExpenseAttributes {
  id?: string;
  title: string;
  amount: number;
  date: string;
  note: string | null;
  db_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
  // FK
  user_id: string;
  category_id: string;
}

export const TypeBox_getAllExpense = {
  query: Type.Object({
    page: Type.String({ minLength: 1, maxLength: 5 }),
    limit: Type.String({ minLength: 1, maxLength: 5 }),
    category_id: Type.Optional(Type.String({ minLength: 5, maxLength: 50 })),
    start: Type.Optional(Type.String({ minLength: 1, maxLength: 20 })),
    end: Type.Optional(Type.String({ minLength: 1, maxLength: 20 })),
  }),
};

export const TypeBox_addExpense = {
  body: Type.Object({
    title: Type.String({ minLength: 1, maxLength: 100 }),
    amount: Type.Number({ minLength: 4, maxLength: 30 }),
    date: Type.Number({ minLength: 5, maxLength: 20 }),
    category_id: Type.String({ minLength: 1, maxLength: 50 }),
    note: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  }),
};
