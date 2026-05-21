/*
  Warnings:

  - You are about to drop the column `category_id` on the `positions` table. All the data in the column will be lost.
  - You are about to drop the `position_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserFollowStatus" AS ENUM ('FOLLOW', 'UNFOLLOW');

-- DropForeignKey
ALTER TABLE "positions" DROP CONSTRAINT "positions_category_id_fkey";

-- DropIndex
DROP INDEX "positions_category_id_idx";

-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "company_category_id" TEXT;

-- AlterTable
ALTER TABLE "positions" DROP COLUMN "category_id";

-- DropTable
DROP TABLE "position_categories";

-- CreateTable
CREATE TABLE "company_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "company_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "followers" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "followers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "followers_follower_id_idx" ON "followers"("follower_id");

-- CreateIndex
CREATE INDEX "followers_following_id_idx" ON "followers"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "followers_follower_id_following_id_key" ON "followers"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "companies_company_category_id_idx" ON "companies"("company_category_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_company_category_id_fkey" FOREIGN KEY ("company_category_id") REFERENCES "company_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
