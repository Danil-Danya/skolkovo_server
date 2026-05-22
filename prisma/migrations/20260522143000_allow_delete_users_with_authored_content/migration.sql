-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_author_id_fkey";

-- DropForeignKey
ALTER TABLE "news" DROP CONSTRAINT "news_author_id_fkey";

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "author_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "news" ALTER COLUMN "author_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
