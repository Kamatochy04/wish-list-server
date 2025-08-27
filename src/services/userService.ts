import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const exchangeRates = {
  USD: 0.31,
  BYN: 1,
  RUB: 27.5,
};

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

  // console.log()

  return {
    ...user,
  };
};

export const getUserSettings = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      currency: true,
    },
  });
  if (!user) throw new Error('User not found');
  return user;
};

export const updateUserSettings = async (
  userId: number,
  data: {
    email?: string;
    name?: string;
    password?: string;
    currency?: 'USD' | 'BYN' | 'RUB';
  }
) => {
  const updateData: any = {};
  if (data.email) updateData.email = data.email;
  if (data.name) updateData.name = data.name;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
  if (data.currency) updateData.currency = data.currency;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      currency: true,
    },
  });
  return user;
};

// Функция для конвертации цены
const convertPrice = (
  price: number | null,
  fromCurrency: 'USD' | 'BYN' | 'RUB' | null,
  toCurrency: 'USD' | 'BYN' | 'RUB'
) => {
  if (!price || !fromCurrency) return null;
  if (fromCurrency === toCurrency) return price;

  // Конвертация в BYN (базовая валюта)
  const priceInBYN = price / exchangeRates[fromCurrency];
  // Конвертация из BYN в целевую валюту
  return Math.round(priceInBYN * exchangeRates[toCurrency]);
};

// Обновление giftService для конвертации цен
export const getAllGifts = async (baseUrl: string, userId?: number) => {
  const currentDate = new Date();
  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: { currency: true },
      })
    : null;
  const targetCurrency = user?.currency || 'BYN'; // По умолчанию BYN, если пользователь не указан или валюта не выбрана

  const events = await prisma.event.findMany({
    where: {
      publicUrl: { not: null },
      publicUrlExpiration: { gt: currentDate },
    },
    include: {
      gifts: {
        where: { isReserved: false },
        select: {
          id: true,
          name: true,
          eventId: true,
          description: true,
          imagePath: true,
          price: true,
          currency: true,
          externalLink: true,
        },
      },
    },
  });

  return events.flatMap(event =>
    event.gifts.map(gift => ({
      id: gift.id,
      name: gift.name,
      eventTitle: event.title,
      eventId: gift.eventId,
      description: gift.description,
      imagePath: gift.imagePath ? `${baseUrl}/${gift.imagePath}` : null,
      price: convertPrice(gift.price, gift.currency, targetCurrency),
      currency: targetCurrency,
      externalLink: gift.externalLink,
    }))
  );
};

export const getUserGifts = async (userId: number, baseUrl: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { currency: true },
  });
  const targetCurrency = user?.currency || 'BYN'; // По умолчанию BYN

  const gifts = await prisma.gift.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      eventId: true,
      description: true,
      imagePath: true,
      price: true,
      currency: true,
      externalLink: true,
      event: { select: { title: true } },
    },
  });

  return gifts.map(gift => ({
    id: gift.id,
    name: gift.name,
    eventTitle: gift.event ? gift.event.title : null,
    eventId: gift.eventId,
    description: gift.description,
    imagePath: gift.imagePath ? `${baseUrl}/${gift.imagePath}` : null,
    price: convertPrice(gift.price, gift.currency, targetCurrency),
    currency: targetCurrency,
    externalLink: gift.externalLink,
  }));
};
