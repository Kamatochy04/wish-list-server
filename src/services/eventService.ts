import { PrismaClient } from "@prisma/client";
import redisClient from "../config/redis";

const prisma = new PrismaClient();

export const createEvent = async (userId: number, title: string) => {
  return prisma.event.create({
    data: { title, userId },
  });
};

export const deleteEvent = async (userId: number, eventId: number) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error("Event not found or not authorized");
  await prisma.event.delete({ where: { id: eventId } });
};

export const updateEvent = async (
  userId: number,
  eventId: number,
  title: string
) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error("Event not found or not authorized");
  return prisma.event.update({
    where: { id: eventId },
    data: { title },
  });
};

export const getUserEvents = async (userId: number) => {
  return prisma.event.findMany({ where: { userId }, include: { gifts: true } });
};

export const generatePublicUrl = async (eventId: number, userId: number) => {
  const event = await prisma.event.findFirst({
    where: { id: eventId, userId },
  });
  if (!event) throw new Error("Event not found or not authorized");

  // Dynamically import nanoid
  const { nanoid } = await import("nanoid");
  const shortId = nanoid(8);
  const publicUrl = `http://localhost:${process.env.PORT}/events/public/${shortId}`;
  await prisma.event.update({
    where: { id: eventId },
    data: { publicUrl },
  });
  await redisClient.setEx(
    `url:${shortId}`,
    30 * 24 * 60 * 60,
    eventId.toString()
  );
  return publicUrl;
};

export const getPublicEvent = async (shortId: string) => {
  const eventId = await redisClient.get(`url:${shortId}`);
  if (!eventId) throw new Error("Invalid or expired URL");
  const event = await prisma.event.findUnique({
    where: { id: parseInt(eventId) },
    include: { gifts: true },
  });
  if (!event) throw new Error("Event not found");
  return event;
};
