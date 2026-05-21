ALTER TABLE "events"
ALTER COLUMN "status" TYPE TEXT
USING "status"::text;
