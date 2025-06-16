import { Request, Response } from "express";
import * as giftService from "../services/giftService";
import { z } from "zod";
import { createGiftSchema, updateGiftSchema } from "../validation/validation";

export const createGift = async (req: Request, res: Response) => {
  try {
    const data = createGiftSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const gift = await giftService.createGift(data.eventId, userId, data.name);
    res.status(201).json(gift);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const updateGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateGiftSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const gift = await giftService.updateGift(parseInt(id), userId, data.name);
    res.status(200).json(gift);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const deleteGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    await giftService.deleteGift(parseInt(id), userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
