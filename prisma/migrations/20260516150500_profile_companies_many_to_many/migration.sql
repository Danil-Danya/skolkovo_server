-- CreateTable
CREATE TABLE "profile_companies" (
    "profile_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_companies_pkey" PRIMARY KEY ("profile_id","company_id")
);

-- Copy existing single-company assignments into the join table
INSERT INTO "profile_companies" ("profile_id", "company_id", "created_at")
SELECT "id", "company_id", CURRENT_TIMESTAMP
FROM "profiles"
WHERE "company_id" IS NOT NULL
ON CONFLICT ("profile_id", "company_id") DO NOTHING;

-- CreateIndex
CREATE INDEX "profile_companies_company_id_idx" ON "profile_companies"("company_id");

-- AddForeignKey
ALTER TABLE "profile_companies" ADD CONSTRAINT "profile_companies_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profile_companies" ADD CONSTRAINT "profile_companies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT IF EXISTS "profiles_company_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "profiles_company_id_idx";

-- DropColumn
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "company_id";
