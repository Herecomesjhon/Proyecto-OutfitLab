-- CreateTable
CREATE TABLE "explore_like" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "explore_like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "explore_comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,

    CONSTRAINT "explore_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "explore_like_user_id_post_id_key" ON "explore_like"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "explore_like" ADD CONSTRAINT "explore_like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explore_like" ADD CONSTRAINT "explore_like_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "explore_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explore_comment" ADD CONSTRAINT "explore_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "explore_comment" ADD CONSTRAINT "explore_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "explore_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
