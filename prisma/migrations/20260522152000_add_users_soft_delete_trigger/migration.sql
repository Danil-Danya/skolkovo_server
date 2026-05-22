CREATE OR REPLACE FUNCTION "soft_delete_user"()
RETURNS TRIGGER
AS $$
BEGIN
    UPDATE "events"
    SET "author_id" = NULL
    WHERE "author_id" = OLD."id";

    UPDATE "news"
    SET "author_id" = NULL
    WHERE "author_id" = OLD."id";

    DELETE FROM "event_registrations"
    WHERE "user_id" = OLD."id";

    DELETE FROM "user_roles"
    WHERE "user_id" = OLD."id";

    DELETE FROM "followers"
    WHERE "follower_id" = OLD."id"
       OR "following_id" = OLD."id";

    DELETE FROM "read_notifications"
    WHERE "user_id" = OLD."id";

    DELETE FROM "profiles"
    WHERE "user_id" = OLD."id";

    UPDATE "users"
    SET "deleted_at" = COALESCE("deleted_at", NOW()),
        "tg_chat_id" = NULL,
        "tg_user_name" = NULL
    WHERE "id" = OLD."id";

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "users_soft_delete_trigger" ON "users";

CREATE TRIGGER "users_soft_delete_trigger"
BEFORE DELETE ON "users"
FOR EACH ROW
EXECUTE FUNCTION "soft_delete_user"();
