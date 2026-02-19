/*
  Warnings:

  - You are about to drop the column `style` on the `explore_post` table. All the data in the column will be lost.
  - You are about to drop the column `outfitCollectionId` on the `outfit` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `outfit` table. All the data in the column will be lost.
  - You are about to drop the column `caption` on the `outfit_photo` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `outfit_photo` table. All the data in the column will be lost.
  - You are about to drop the column `isPublic` on the `outfit_photo` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `outfit_photo` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `explore_post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "outfit" DROP CONSTRAINT "outfit_outfitCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "outfit_photo" DROP CONSTRAINT "outfit_photo_user_id_fkey";

-- AlterTable
ALTER TABLE "explore_post" DROP COLUMN "style",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "outfit" DROP COLUMN "outfitCollectionId",
DROP COLUMN "photo_url",
ADD COLUMN     "collection_id" TEXT;

-- AlterTable
ALTER TABLE "outfit_photo" DROP COLUMN "caption",
DROP COLUMN "image_url",
DROP COLUMN "isPublic",
DROP COLUMN "user_id",
ADD COLUMN     "url" TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "outfit_collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explore_post" ADD CONSTRAINT "explore_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
