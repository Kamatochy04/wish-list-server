import { Request, Response } from 'express';
import * as eventService from '../services/eventService';
import { z } from 'zod';
import { createEventSchema, updateEventSchema } from '../validation/validation';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const parseFormData = (req: Request): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(__dirname, '../../Uploads/events'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
    });

    form.parse(req, (err, fields, files) => {
      if (err)
        return reject(new Error(`Ошибка парсинга формы: ${err.message}`));
      // Преобразуем массивы в строки
      const normalizedFields = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value,
        ])
      );
      resolve({ fields: normalizedFields, files });
    });
  });
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { fields, files } = await parseFormData(req);

    const data = createEventSchema.parse({
      title: fields.title,
      description: fields.description,
      eventDate: fields.eventDate
        ? new Date(fields.eventDate).toISOString()
        : undefined,
    });

    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let imagePath: string | undefined;

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const ext = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
      const newFilename = `event_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
      const newFilePath = path.join(
        __dirname,
        '../../Uploads/events',
        newFilename
      );
      fs.renameSync(file.filepath, newFilePath);
      imagePath = newFilename;
    }

    const event = await eventService.createEvent(
      userId,
      data,
      imagePath,
      baseUrl
    );

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { fields, files } = await parseFormData(req);
    console.log('Form fields:', fields);
    console.log('Form files:', files);

    const { id } = req.params;
    const data = updateEventSchema.parse({
      title: fields.title,
      description: fields.description,
      eventDate: fields.eventDate
        ? new Date(fields.eventDate).toISOString()
        : undefined,
    });

    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let imagePath: string | undefined;

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const ext = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
      const newFilename = `event_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
      const newFilePath = path.join(
        __dirname,
        '../../Uploads/events',
        newFilename
      );
      fs.renameSync(file.filepath, newFilePath);
      imagePath = newFilename;
    }

    const event = await eventService.updateEvent(
      parseInt(id),
      userId,
      data,
      imagePath,
      baseUrl
    );
    res.status(200).json(event);
  } catch (error) {
    console.error('Update event error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(400).json({ error: (error as Error).message });
    }
  }
};

export const getUserEvents = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const events = await eventService.getUserEvents(userId, baseUrl);
    res.status(200).json(events);
  } catch (error) {
    console.error('Get user events error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const event = await eventService.getEventById(
      parseInt(id),
      userId,
      baseUrl
    );
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event by id error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    await eventService.deleteEvent(parseInt(id), userId);
    res.status(204).send();
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};
