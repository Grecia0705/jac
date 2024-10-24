import bcryptjs from "bcrypt";

export const encryptPassword = async (password: string) => {
    const hash = await bcryptjs.hash(password, 11);
    return hash;
};

export const matchPassword = async function(password: string, passwordParam: string) {
return await bcryptjs.compare(password, passwordParam);
};
