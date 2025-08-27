-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_eventId_fkey";

-- AlterTable
ALTER TABLE "Gift" ALTER COLUMN "eventId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
