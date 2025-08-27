-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'BYN', 'RUB');

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "currency" "Currency",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "imagePath" TEXT,
ADD COLUMN     "price" DECIMAL(65,30);
