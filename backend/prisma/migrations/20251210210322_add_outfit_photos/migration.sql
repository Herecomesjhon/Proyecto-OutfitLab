/*
  Warnings:

  - You are about to drop the column `is_favorite` on the `outfit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "outfit" DROP COLUMN "is_favorite";

-- CreateTable
CREATE TABLE "outfit_photo" (
    "id" TEXT NOT NULL,
    "outfit_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "caption" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "outfit_photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outfit_photo" ADD CONSTRAINT "outfit_photo_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_photo" ADD CONSTRAINT "outfit_photo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
