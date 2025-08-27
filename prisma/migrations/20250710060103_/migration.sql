/*
  Warnings:

  - Added the required column `code` to the `GiftReservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `GiftReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GiftReservation" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT;
