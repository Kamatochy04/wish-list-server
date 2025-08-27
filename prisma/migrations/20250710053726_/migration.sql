/*
  Warnings:

  - You are about to drop the column `code` on the `GiftReservation` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `GiftReservation` table. All the data in the column will be lost.
  - You are about to drop the column `isConfirmed` on the `GiftReservation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `GiftReservation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `GiftReservation` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Gift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GiftReservation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_eventId_fkey";

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "externalLink" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GiftReservation" DROP COLUMN "code",
DROP COLUMN "email",
DROP COLUMN "isConfirmed",
DROP COLUMN "name",
DROP COLUMN "updatedAt",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
