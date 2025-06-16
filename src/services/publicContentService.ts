import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPublicGiftsForSlideshow = async () => {
  const currentDate = new Date();
  const events = await prisma.event.findMany({
    where: {
      publicUrl: { not: null },
      publicUrlExpiration: { gt: currentDate },
    },
    include: {
      gifts: {
        where: { isReserved: false },
        select: { id: true, name: true, eventId: true },
      },
    },
  });

  const gifts = events.flatMap((event) =>
    event.gifts.map((gift) => ({
      id: gift.id,
      name: gift.name,
      eventTitle: event.title,
      eventId: gift.eventId,
    }))
  );

  return gifts;
};
