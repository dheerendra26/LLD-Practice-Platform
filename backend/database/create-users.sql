CREATE TABLE IF NOT EXISTS "users" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" varchar(100) NOT NULL,
    "email" varchar(255) NOT NULL,
    "passwordHash" varchar(255) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT "UQ_users_email" UNIQUE ("email")
);