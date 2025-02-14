import bcrypt from "bcrypt";

export const generateHashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT as unknown as string)
    );
  } catch (error) {
    console.error("Error generateHashPassword: ", error);
    return 0;
  }
};

export const passwordVerify = async (value: string, hashValue: string) => {
  try {
    return await bcrypt.compare(value, hashValue);
  } catch (error) {
    console.error("Error passwordVerify: ", error);
    return 0;
  }
};
