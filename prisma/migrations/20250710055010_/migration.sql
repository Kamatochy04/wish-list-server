/*
  Warnings:

  - Made the column `eventId` on table `Gift` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_eventId_fkey";

-- AlterTable
ALTER TABLE "Gift" ALTER COLUMN "eventId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
