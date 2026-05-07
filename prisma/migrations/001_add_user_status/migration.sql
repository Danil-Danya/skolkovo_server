DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type
        WHERE typname = 'UserStatus'
    ) THEN
        CREATE TYPE "UserStatus" AS ENUM ('BANNED', 'WAITING', 'ACTIVE');
    END IF;
END $$;

ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "status" "UserStatus" NOT NULL DEFAULT 'WAITING';
