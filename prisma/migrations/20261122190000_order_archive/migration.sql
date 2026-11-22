-- Архивиране на поръчки вместо изтриване
ALTER TABLE "orders" ADD COLUMN "archivedAt" TIMESTAMP(3),
ADD COLUMN "archivedBy" TEXT;
