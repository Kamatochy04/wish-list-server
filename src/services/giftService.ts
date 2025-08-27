import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GiftData {
  eventId?: number | null;
  description?: string;
  price?: number;
  currency?: 'USD' | 'BYN' | 'RUB';
  externalLink?: string;
  imagePath?: string;
  baseUrl: string;
}

export const createGift = async (
  userId: number,
  name: string,
  data: GiftData
) => {
  const gift = await prisma.gift.create({
    data: {
      name,
      eventId: data.eventId ?? null,
      userId,
      description: data.description,
      price: data.price,
      currency: data.currency,
      externalLink: data.externalLink,
      imagePath: data.imagePath,
      likes: 0,
    },
    include: {
      event: { select: { title: true } },
    },
  });

  const result = {
    ...gift,
    imagePath: gift.imagePath
      ? `${data.baseUrl}/Uploads/gifts/${gift.imagePath}`
      : null,
    price: gift.price ? gift.price : null,
  };
  console.log('Created gift:', result);
  return result;
};

export const updateGift = async (
  giftId: number,
  userId: number,
  name: string,
  data: GiftData
) => {
  const gift = await prisma.gift.findFirst({
    where: { id: giftId, userId },
  });
  if (!gift) throw new Error('Подарок не найден или вы не авторизованы');

  const updatedGift = await prisma.gift.update({
    where: { id: giftId },
    data: {
      name,
      description: data.description,
      price: data.price,
      currency: data.currency,
      externalLink: data.externalLink,
      imagePath: data.imagePath,
      eventId: data.eventId ?? null,
    },
    include: {
      event: { select: { title: true } },
    },
  });

  const result = {
    ...updatedGift,
    imagePath: updatedGift.imagePath
      ? `${data.baseUrl}/Uploads/gifts/${updatedGift.imagePath}`
      : null,
    price: updatedGift.price ? updatedGift.price : null,
  };
  console.log('Updated gift:', result);
  return result;
};

export const deleteGift = async (giftId: number, userId: number) => {
  const gift = await prisma.gift.findFirst({
    where: { id: giftId, userId },
  });
  if (!gift) throw new Error('Подарок не найден или вы не авторизованы');
  await prisma.gift.delete({ where: { id: giftId } });
  console.log('Deleted gift id:', giftId);
  return giftId;
};

export const getAllGifts = async (baseUrl: string) => {
  const currentDate = new Date();
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
          likes: true,
          event: { select: { title: true } },
        },
      },
    },
  });

  const result = events.flatMap(event =>
    event.gifts.map(gift => ({
      ...gift,
      eventTitle: event.title,
      imagePath: gift.imagePath
        ? `${baseUrl}/Uploads/gifts/${gift.imagePath}`
        : null,
      price: gift.price ? gift.price : null,
    }))
  );
  console.log('All gifts:', result);
  return result;
};

export const getUserGifts = async (userId: number, baseUrl: string) => {
  const gifts = await prisma.gift.findMany({
    where: { userId },
    include: {
      event: { select: { title: true } },
    },
  });

  const result = gifts.map(gift => ({
    ...gift,
    eventTitle: gift.event ? gift.event.title : null,
    imagePath: gift.imagePath
      ? `${baseUrl}/Uploads/gifts/${gift.imagePath}`
      : null,
    price: gift.price ? gift.price : null,
  }));

  return result;
};

export const getRandomGifts = async (baseUrl: string) => {
  const gifts = await prisma.gift.findMany({
    take: 6,
    orderBy: {
      id: 'asc',
    },
  });

  const shuffledGifts = gifts.sort(() => Math.random() - 0.5);

  const result = shuffledGifts.map(gift => ({
    id: gift.id,
    name: gift.name,
    eventId: gift.eventId,
    description: gift.description,
    imagePath: gift.imagePath
      ? `${baseUrl}/Uploads/gifts/${gift.imagePath}`
      : null,
    price: gift.price ? Number(gift.price) : null,
    currency: gift.currency,
    externalLink: gift.externalLink,
    isReserved: gift.isReserved,
    likes: gift.likes,
    createdAt: gift.createdAt,
    updatedAt: gift.updatedAt,
  }));

  return result;
};

export const getPopularGifts = async (baseUrl: string) => {
  const gifts = await prisma.gift.findMany({
    take: 6,
    orderBy: {
      likes: 'desc',
    },
    include: {
      event: { select: { title: true } },
    },
  });

  const result = gifts.map(gift => ({
    id: gift.id,
    name: gift.name,
    eventId: gift.eventId,
    description: gift.description,
    imagePath: gift.imagePath
      ? `${baseUrl}/Uploads/gifts/${gift.imagePath}`
      : null,
    price: gift.price ? Number(gift.price) : null,
    currency: gift.currency,
    externalLink: gift.externalLink,
    isReserved: gift.isReserved,
    likes: gift.likes,
    createdAt: gift.createdAt,
    updatedAt: gift.updatedAt,
    eventTitle: gift.event ? gift.event.title : null,
  }));

  return result;
};

export const addLike = async (
  giftId: number,
  userId: number,
  baseUrl: string
) => {
  const existingLike = await prisma.giftLike.findUnique({
    where: {
      giftId_userId: {
        giftId,
        userId,
      },
    },
  });

  if (existingLike) {
    throw new Error('Вы уже поставили лайк этому подарку');
  }

  await prisma.$transaction([
    prisma.giftLike.create({
      data: {
        giftId,
        userId,
      },
    }),
    prisma.gift.update({
      where: { id: giftId },
      data: {
        likes: { increment: 1 },
      },
    }),
  ]);

  const updatedGift = await prisma.gift.findUnique({
    where: { id: giftId },
    include: {
      event: { select: { title: true } },
    },
  });

  if (!updatedGift) {
    throw new Error('Подарок не найден');
  }

  return {
    ...updatedGift,
    imagePath: updatedGift.imagePath
      ? `${baseUrl}/Uploads/gifts/${updatedGift.imagePath}`
      : null,
    price: updatedGift.price ? Number(updatedGift.price) : null,
    eventTitle: updatedGift.event ? updatedGift.event.title : null,
  };
};

export const removeLike = async (
  giftId: number,
  userId: number,
  baseUrl: string
) => {
  const existingLike = await prisma.giftLike.findUnique({
    where: {
      giftId_userId: {
        giftId,
        userId,
      },
    },
  });

  if (!existingLike) {
    throw new Error('Лайк не найден');
  }

  await prisma.$transaction([
    prisma.giftLike.delete({
      where: {
        giftId_userId: {
          giftId,
          userId,
        },
      },
    }),
    prisma.gift.update({
      where: { id: giftId },
      data: {
        likes: { decrement: 1 },
      },
    }),
  ]);

  const updatedGift = await prisma.gift.findUnique({
    where: { id: giftId },
    include: {
      event: { select: { title: true } },
    },
  });

  if (!updatedGift) {
    throw new Error('Подарок не найден');
  }

  return {
    ...updatedGift,
    imagePath: updatedGift.imagePath
      ? `${baseUrl}/Uploads/gifts/${updatedGift.imagePath}`
      : null,
    price: updatedGift.price ? Number(updatedGift.price) : null,
    eventTitle: updatedGift.event ? updatedGift.event.title : null,
  };
};
