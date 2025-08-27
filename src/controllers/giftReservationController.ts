import { Request, Response } from 'express';
import * as giftReservationService from '../services/giftReservationService';

import { z } from 'zod';
import {
  confirmReservationSchema,
  reserveGiftSchema,
} from '../validation/validation';

export const reserveGift = async (req: Request, res: Response) => {
  try {
    const { giftId } = req.params;
    const data = reserveGiftSchema.parse({
      ...req.body,
      giftId: parseInt(giftId),
    });
    const result = await giftReservationService.reserveGift(
      data.giftId,
      data.name,
      data.email
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

export const confirmReservation = async (req: Request, res: Response) => {
  try {
    const data = confirmReservationSchema.parse(req.body);
    const result = await giftReservationService.confirmReservation(
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
