import bcrypt from "bcrypt";

import { consoleLog } from "../util/consoleLog";

export const generateHashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT as unknown as string)
    );
  } catch (error) {
    consoleLog("Error generateHashPassword: ", error);

    return 0;
  }
};

export const passwordVerify = async (value: string, hashValue: string) => {
  try {
    return await bcrypt.compare(value, hashValue);
  } catch (error) {
    consoleLog("Error passwordVerify: ", error);

    return 0;
  }
};
