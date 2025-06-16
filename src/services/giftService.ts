import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createGift = async (
  userId: number,
  eventId: number,
  name: string
) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error("Event not found or not authorized");
  return prisma.gift.create({
    data: { name, eventId },
  });
};

export const updateGift = async (
  userId: number,
  giftId: number,
  name: string
) => {
  const gift = await prisma.gift.findFirst({
    where: { id: giftId, event: { userId } },
  });
  if (!gift) throw new Error("Gift not found or not authorized");
  return prisma.gift.update({
    where: { id: giftId },
    data: { name },
  });
};

export const deleteGift = async (userId: number, giftId: number) => {
  const gift = await prisma.gift.findFirst({
    where: { id: giftId, event: { userId } },
  });
  if (!gift) throw new Error("Gift not found or not authorized");
  await prisma.gift.delete({ where: { id: giftId } });
};
