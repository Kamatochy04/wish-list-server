import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUserEvents = async (userId: number, baseUrl: string) => {
  const events = await prisma.event.findMany({
    where: { userId },
    include: { gifts: { select: { id: true, name: true } } },
  });

  return events.map(event => ({
    ...event,
    imagePath: event.imagePath
      ? `${baseUrl}/uploads/events/${event.imagePath}`
      : null,
    eventDate: event.eventDate ? event.eventDate.toISOString() : null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    publicUrlExpiration: event.publicUrlExpiration
      ? event.publicUrlExpiration.toISOString()
      : null,
  }));
};

export const createEvent = async (
  userId: number,
  data: { title: string; description?: string; eventDate?: string },
  imagePath?: string,
  baseUrl?: string
) => {
  const event = await prisma.event.create({
    data: {
      title: data.title,
      userId,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      imagePath,
    },
    include: { gifts: { select: { id: true, name: true } } },
  });

  return {
    ...event,
    imagePath: event.imagePath
      ? `${baseUrl}/uploads/events/${event.imagePath}`
      : null,
    eventDate: event.eventDate ? event.eventDate.toISOString() : null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    publicUrlExpiration: event.publicUrlExpiration
      ? event.publicUrlExpiration.toISOString()
      : null,
  };
};

export const updateEvent = async (
  eventId: number,
  userId: number,
  data: { title?: string; description?: string; eventDate?: string },
  imagePath?: string,
  baseUrl?: string
) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error('Событие не найдено или вы не авторизованы');

  const updatedEvent = await prisma.event.update({
    where: { id: eventId },
    data: {
      title: data.title,
      description: data.description,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      imagePath,
    },
    include: { gifts: { select: { id: true, name: true } } },
  });

  return {
    ...updatedEvent,
    imagePath: updatedEvent.imagePath
      ? `${baseUrl}/uploads/events/${updatedEvent.imagePath}`
      : null,
    eventDate: updatedEvent.eventDate
      ? updatedEvent.eventDate.toISOString()
      : null,
    createdAt: updatedEvent.createdAt.toISOString(),
    updatedAt: updatedEvent.updatedAt.toISOString(),
    publicUrlExpiration: updatedEvent.publicUrlExpiration,
  };
};

export const getEventById = async (
  eventId: number,
  userId: number,
  baseUrl: string
) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
    include: { gifts: { select: { id: true, name: true } } },
  });
  if (!event) throw new Error('Событие не найдено или вы не авторизованы');

  return {
    ...event,
    imagePath: event.imagePath
      ? `${baseUrl}/uploads/events/${event.imagePath}`
      : null,
    eventDate: event.eventDate ? event.eventDate.toISOString() : null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    publicUrlExpiration: event.publicUrlExpiration
      ? event.publicUrlExpiration.toISOString()
      : null,
  };
};

export const deleteEvent = async (eventId: number, userId: number) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error('Событие не найдено или вы не авторизованы');
  await prisma.event.delete({ where: { id: eventId } });
};
