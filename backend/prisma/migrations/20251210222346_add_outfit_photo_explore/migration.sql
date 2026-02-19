/*
  Warnings:

  - You are about to drop the column `collection_id` on the `outfit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "outfit" DROP CONSTRAINT "outfit_collection_id_fkey";

-- AlterTable
ALTER TABLE "outfit" DROP COLUMN "collection_id",
ADD COLUMN     "outfitCollectionId" TEXT,
ADD COLUMN     "photo_url" TEXT;

-- CreateTable
CREATE TABLE "explore_post" (
    "id" TEXT NOT NULL,
    "outfit_id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "style" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "explore_post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_outfitCollectionId_fkey" FOREIGN KEY ("outfitCollectionId") REFERENCES "outfit_collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explore_post" ADD CONSTRAINT "explore_post_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
