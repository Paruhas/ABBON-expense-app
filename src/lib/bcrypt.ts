import bcrypt from "bcrypt";

export const generateHashPassword = async (password: string) => {
  return await bcrypt.hash(
    password,
    parseInt(process.env.BCRYPT_SALT as unknown as string)
  );
};

export const passwordVerify = async (value: string, hashValue: string) => {
  return await bcrypt.compare(value, hashValue);
};
