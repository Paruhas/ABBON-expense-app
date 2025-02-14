export interface UserAttributes {
  id?: string;
  email: string;
  hash_password: string;
  refresh_token: string;
  db_status?: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}
