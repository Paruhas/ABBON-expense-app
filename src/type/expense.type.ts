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
