import { Request, Response } from "express";
import * as eventService from "../services/eventService";
import { z } from "zod";
import { createEventSchema, updateEventSchema } from "../validation/validation";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const data = createEventSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const event = await eventService.createEvent(userId, data.title);
    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    await eventService.deleteEvent(userId, parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = updateEventSchema.parse(req.body);
    const userId = (req as any).user.userId;
    const event = await eventService.updateEvent(
      userId,
      parseInt(id),
      data.title
    );
    res.status(200).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const events = await eventService.getUserEvents(userId);
    res.status(200).json(events);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const generatePublicUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const publicUrl = await eventService.generatePublicUrl(
      parseInt(id),
      userId
    );
    res.status(200).json({ publicUrl });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getPublicEvent = async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;
    const event = await eventService.getPublicEvent(shortId);
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
