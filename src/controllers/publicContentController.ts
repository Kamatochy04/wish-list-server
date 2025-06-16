import { Request, Response } from "express";
import * as publicContentService from "../services/publicContentService";

export const getPublicGiftsForSlideshow = async (
  req: Request,
  res: Response
) => {
  try {
    const gifts = await publicContentService.getPublicGiftsForSlideshow();
    res.status(200).json(gifts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
