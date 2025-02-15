import { Type, type Static } from "@sinclair/typebox";

export const TypeBox_getReportExpense = {
  query: Type.Object({
    start: Type.String({ minLength: 1, maxLength: 20 }),
    end: Type.String({ minLength: 1, maxLength: 20 }),
  }),
};
