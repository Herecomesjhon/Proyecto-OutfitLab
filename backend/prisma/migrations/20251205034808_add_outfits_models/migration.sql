-- CreateTable
CREATE TABLE "outfit_collection" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfit_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "collection_id" TEXT,
    "name" TEXT,
    "occasion" TEXT,
    "dressCode" TEXT,
    "weather" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outfit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outfit_prenda" (
    "outfit_id" TEXT NOT NULL,
    "prenda_id" INTEGER NOT NULL,

    CONSTRAINT "outfit_prenda_pkey" PRIMARY KEY ("outfit_id","prenda_id")
);

-- AddForeignKey
ALTER TABLE "outfit_collection" ADD CONSTRAINT "outfit_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit" ADD CONSTRAINT "outfit_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "outfit_collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_prenda" ADD CONSTRAINT "outfit_prenda_outfit_id_fkey" FOREIGN KEY ("outfit_id") REFERENCES "outfit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outfit_prenda" ADD CONSTRAINT "outfit_prenda_prenda_id_fkey" FOREIGN KEY ("prenda_id") REFERENCES "clothes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
