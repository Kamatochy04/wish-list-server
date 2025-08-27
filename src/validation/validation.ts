import { z } from 'zod';

// --------------- авторизация
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const verifyCodeSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

export const resetPasswordSchema = z.object({
  resetToken: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// -------------- события
export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  eventDate: z.string().datetime().optional(),
});

export const updateEventSchema = z.object({
  title: z.string().min(1, 'Title is required'),
});

// ---------------------------- подарки
export const createGiftSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  eventId: z.number().nullable().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.enum(['USD', 'BYN', 'RUB']).optional(),
  externalLink: z.string().url().optional(),
});

export const updateGiftSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  eventId: z.number().nullable().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  currency: z.enum(['USD', 'BYN', 'RUB']).optional(),
  externalLink: z.string().url().optional(),
});

export const reserveGiftSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  giftId: z.number(),
});

export const confirmReservationSchema = z.object({
  email: z.string().email('Invalid email address'),
  code: z.string().length(6, 'Code must be 6 digits'),
});

// --------- настройки пользователя
export const updateUserSettingsSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
  currency: z.enum(['USD', 'BYN', 'RUB']).optional(),
});
