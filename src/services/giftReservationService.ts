import { PrismaClient } from '@prisma/client';
import redisClient from '../config/redis';
import { sendReservationCodeEmail } from '../config/email';

const prisma = new PrismaClient();

export const reserveGift = async (
  giftId: number,
  name: string,
  email: string
) => {
  const gift = await prisma.gift.findUnique({
    where: { id: giftId },
    include: { event: true },
  });
  if (!gift) throw new Error('Gift not found');
  if (gift.isReserved) throw new Error('Gift is already reserved');

  if (!gift.event) {
    throw new Error('Gift is not associated with an event');
  }

  if (!gift.event.publicUrl || gift.event.publicUrlExpiration! < new Date()) {
    throw new Error('Event is not public or link has expired');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await redisClient.setEx(`reservation_code:${email}:${giftId}`, 600, code);

  await prisma.giftReservation.create({
    data: {
      giftId,
      userId: gift.userId,
      name,

      email,
      code,
    },
  });

  await prisma.gift.update({
    where: { id: giftId },
    data: { isReserved: true },
  });

  await sendReservationCodeEmail(email, code, gift.name, gift.event.title);

  return { message: 'Reservation code sent to your email' };
};

export const confirmReservation = async (email: string, code: string) => {
  const reservations = await prisma.giftReservation.findMany({
    where: { email, code, isConfirmed: false },
    include: { gift: true },
  });
  if (reservations.length === 0) throw new Error('Invalid or expired code');

  const reservation = reservations[0];
  const storedCode = await redisClient.get(
    `reservation_code:${email}:${reservation.giftId}`
  );
  if (!storedCode || storedCode !== code)
    throw new Error('Invalid or expired code');

  await prisma.giftReservation.update({
    where: { id: reservation.id },
    data: { isConfirmed: true },
  });

  await redisClient.del(`reservation_code:${email}:${reservation.giftId}`);

  return { message: 'Reservation confirmed successfully' };
};
