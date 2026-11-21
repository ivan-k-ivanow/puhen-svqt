-- CreateEnum
CREATE TYPE "ProductFieldType" AS ENUM ('PHOTO', 'TEXT', 'TEXTAREA', 'DATE', 'CHOICE');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('CALL', 'VIBER', 'MESSENGER');

-- AlterTable
ALTER TABLE "order_items" ADD COLUMN     "personalization" JSONB;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "attribution" JSONB,
ADD COLUMN     "contactMethod" "ContactMethod",
ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "photosDeletedAt" TIMESTAMP(3),
ADD COLUMN     "privacyAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "substitutionConsent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "product_fields" (
    "id" TEXT NOT NULL,
    "type" "ProductFieldType" NOT NULL,
    "label" TEXT NOT NULL,
    "hint" TEXT,
    "placeholder" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "maxLength" INTEGER,
    "maxFiles" INTEGER,
    "options" TEXT[],
    "position" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_fields_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_fields" ADD CONSTRAINT "product_fields_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
