import { Request } from "express";
import { UserAttributes } from "./user.type";
import { CategoryAttributes } from "./category.type";

export interface ExtendedRequest extends Request {
  user?: UserAttributes;
  category?: CategoryAttributes;
}
