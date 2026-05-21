-- AlterTable
ALTER TABLE "news" ADD COLUMN "category_id" TEXT;

-- CreateTable
CREATE TABLE "news_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "news_category_id_idx" ON "news"("category_id");

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "news_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
