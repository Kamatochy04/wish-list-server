import { Request, Response } from 'express';
import * as giftService from '../services/giftService';
import { z } from 'zod';
import { createGiftSchema, updateGiftSchema } from '../validation/validation';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';

const parseFormData = (req: Request): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({
      uploadDir: path.join(__dirname, '../../Uploads/gifts'),
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
    });

    form.parse(req, (err, fields, files) => {
      if (err)
        return reject(new Error(`Ошибка парсинга формы: ${err.message}`));
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

export const createGift = async (req: Request, res: Response) => {
  try {
    const { fields, files } = await parseFormData(req);

    const data = createGiftSchema.parse({
      name: fields.name,
      eventId: fields.eventId ? parseInt(fields.eventId) : null,
      description: fields.description,
      price: fields.price ? parseInt(fields.price) : undefined,
      currency: fields.currency,
      externalLink: fields.externalLink,
    });

    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let imagePath: string | undefined;

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const ext = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
      const originalFilename =
        file.originalFilename || `gift_${Date.now()}${ext}`;
      const sanitizedFilename = sanitize(originalFilename);
      const newFilename = `gift_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
      const newFilePath = path.join(
        __dirname,
        '../../Uploads/gifts',
        newFilename
      );
      console.log('Saving gift file to:', newFilePath);
      fs.renameSync(file.filepath, newFilePath);
      imagePath = newFilename;
    }

    const gift = await giftService.createGift(userId, data.name, {
      eventId: data.eventId,
      description: data.description,
      price: data.price,
      currency: data.currency,
      externalLink: data.externalLink,
      imagePath,
      baseUrl,
    });
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
    const { fields, files } = await parseFormData(req);

    const { id } = req.params;
    const data = updateGiftSchema.parse({
      name: fields.name,
      eventId: fields.eventId ? parseInt(fields.eventId) : null,
      description: fields.description,
      price: fields.price ? parseInt(fields.price) : undefined,
      currency: fields.currency,
      externalLink: fields.externalLink,
    });

    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let imagePath: string | undefined;

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const ext = file.mimetype === 'image/jpeg' ? '.jpg' : '.png';
      // const originalFilename =
      //   file.originalFilename || `gift_${Date.now()}${ext}`;
      // const sanitizedFilename = sanitize(originalFilename);
      const newFilename = `gift_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
      const newFilePath = path.join(
        __dirname,
        '../../Uploads/gifts',
        newFilename
      );

      fs.renameSync(file.filepath, newFilePath);
      imagePath = newFilename;
    }

    const gift = await giftService.updateGift(
      parseInt(id),
      userId,
      data.name!,
      {
        eventId: data.eventId,
        description: data.description,
        price: data.price,
        currency: data.currency,
        externalLink: data.externalLink,
        imagePath,
        baseUrl,
      }
    );

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
    const userId = (req as any).user.id;
    const deletedGiftId = await giftService.deleteGift(parseInt(id), userId);
    res.status(200).json({ id: deletedGiftId });
  } catch (error) {
    console.error('Delete gift error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAllGifts = async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const gifts = await giftService.getAllGifts(baseUrl);
    console.log('All gifts:', gifts);
    res.status(200).json(gifts);
  } catch (error) {
    console.error('Get all gifts error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUserGifts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const gifts = await giftService.getUserGifts(userId, baseUrl);
    res.status(200).json(gifts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRandomGifts = async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const gifts = await giftService.getRandomGifts(baseUrl);
    console.log('Random gifts:', gifts);
    res.status(200).json(gifts);
  } catch (error) {
    console.error('Get random gifts error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getPopularGifts = async (req: Request, res: Response) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    await giftService.getPopularGifts(baseUrl);
    const gifts = await giftService.getPopularGifts(baseUrl);
    res.status(200).json(gifts);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const addLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const gift = await giftService.addLike(parseInt(id), userId, baseUrl);
    res.status(200).json(gift);
  } catch (error) {
    console.error('Add like error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};

export const removeLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const gift = await giftService.removeLike(parseInt(id), userId, baseUrl);
    res.status(200).json(gift);
  } catch (error) {
    console.error('Remove like error:', error);
    res.status(400).json({ error: (error as Error).message });
  }
};
