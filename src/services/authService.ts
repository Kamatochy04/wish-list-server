import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import redisClient from "../config/redis";

const prisma = new PrismaClient();

export const signup = async (
  email: string,
  password: string,
  name?: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  await redisClient.setEx(`session:${user.id}`, 3600, token);
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};

export const signin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });
  await redisClient.setEx(`session:${user.id}`, 3600, token);
  return {
    user: { id: user.id, email: user.email, name: user.name },
    token,
  };
};
