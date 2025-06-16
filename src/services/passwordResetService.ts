import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redisClient from "../config/redis";
import { sendResetCodeEmail } from "../config/email";

const prisma = new PrismaClient();

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  //   const code = Math.floor(100000 + Math.random() * 900000).toString();
  const code = "111111"; // пока код не отправляется он захардкожен
  console.log(code);
  await redisClient.setEx(`reset_code:${email}`, 600, code);

  await sendResetCodeEmail(email, code);

  return { message: "Reset code sent to your email" };
};

export const verifyResetCode = async (email: string, code: string) => {
  const storedCode = await redisClient.get(`reset_code:${email}`);
  if (!storedCode || storedCode !== code) {
    throw new Error("Invalid or expired code");
  }

  const resetToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  await redisClient.setEx(`reset_token:${email}`, 900, resetToken);

  await redisClient.del(`reset_code:${email}`);

  return { resetToken };
};

export const resetPassword = async (
  resetToken: string,
  newPassword: string
) => {
  let decoded;
  try {
    decoded = jwt.verify(resetToken, process.env.JWT_SECRET!) as {
      email: string;
    };
  } catch (error) {
    throw new Error("Invalid or expired reset token");
  }

  const storedToken = await redisClient.get(`reset_token:${decoded.email}`);
  if (!storedToken || storedToken !== resetToken) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email: decoded.email },
    data: { password: hashedPassword },
  });

  await redisClient.del(`reset_token:${decoded.email}`);

  return { message: "Password reset successfully" };
};
