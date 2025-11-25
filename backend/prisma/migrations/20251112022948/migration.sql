-- AlterTable
ALTER TABLE "clothes" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "confidence" DOUBLE PRECISION;

-- CreateIndex
CREATE INDEX "clothes_category_idx" ON "clothes"("category");
