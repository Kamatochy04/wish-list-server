import { Request, Response } from "express";
import * as userService from "../services/userService";
import { z } from "zod";
import { updateUserSettingsSchema } from "../validation/validation";

export const getUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const settings = await userService.getUserSettings(userId);
    res.status(200).json(settings);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const data = updateUserSettingsSchema.parse(req.body);
    const updatedSettings = await userService.updateUserSettings(userId, data);
    res.status(200).json(updatedSettings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};
