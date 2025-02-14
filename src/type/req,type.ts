import { Request } from "express";
import { UserAttributes } from "./user.type";

export interface ExtendedRequest extends Request {
  user?: UserAttributes;
}
