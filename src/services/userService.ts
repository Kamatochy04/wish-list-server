import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const getUserSettings = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  return { id: user.id, email: user.email, name: user.name };
};

export const updateUserSettings = async (
  userId: number,
  data: { email?: string; name?: string; password?: string }
) => {
  const updateData: any = {};
  if (data.email) updateData.email = data.email;
  if (data.name) updateData.name = data.name;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  return { id: user.id, email: user.email, name: user.name };
};
