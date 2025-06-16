-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "publicUrlExpiration" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "isReserved" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "GiftReservation" (
    "id" SERIAL NOT NULL,
    "giftId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT,
    "isConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiftReservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GiftReservation" ADD CONSTRAINT "GiftReservation_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
