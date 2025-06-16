import { Request, Response } from "express";
import * as passwordResetService from "../services/passwordResetService";
import { z } from "zod";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyCodeSchema,
} from "../validation/validation";

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);
    const result = await passwordResetService.requestPasswordReset(data.email);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const data = verifyCodeSchema.parse(req.body);
    const result = await passwordResetService.verifyResetCode(
      data.email,
      data.code
    );
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const data = resetPasswordSchema.parse(req.body);
    const result = await passwordResetService.resetPassword(
      data.resetToken,
      data.newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};
