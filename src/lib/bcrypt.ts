import bcrypt from "bcrypt";

const verifyPassword = async (password: string, enteredPassword: string): Promise<boolean> => {
   return await bcrypt.compare(enteredPassword, password);
};

export default verifyPassword;
