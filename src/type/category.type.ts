export interface CategoryAttributes {
  id?: string;
  name: string;
  db_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
