-- =========================================================
-- EXTENSIONS
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- =========================================================
-- ENUM TYPES
-- =========================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'problem_difficulty'
    ) THEN
        CREATE TYPE problem_difficulty AS ENUM (
            'EASY',
            'MEDIUM',
            'HARD'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'attempt_status'
    ) THEN
        CREATE TYPE attempt_status AS ENUM (
            'DRAFT',
            'SUBMITTED',
            'EVALUATING',
            'COMPLETED',
            'FAILED'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'submission_type'
    ) THEN
        CREATE TYPE submission_type AS ENUM (
            'TEXT'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'evaluation_status'
    ) THEN
        CREATE TYPE evaluation_status AS ENUM (
            'PENDING',
            'EVALUATING',
            'COMPLETED',
            'FAILED'
        );
    END IF;
END
$$;


-- =========================================================
-- OPTIONAL CLEAN RESET
-- Remove these if you already have production data.
-- =========================================================

DROP TABLE IF EXISTS "feedback_items" CASCADE;
DROP TABLE IF EXISTS "evaluations" CASCADE;
DROP TABLE IF EXISTS "submissions" CASCADE;
DROP TABLE IF EXISTS "attempts" CASCADE;
DROP TABLE IF EXISTS "problems" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- =========================================================
-- USERS
-- =========================================================

CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "name" VARCHAR(100) NOT NULL,

    "email" VARCHAR(255) NOT NULL,

    "passwordHash" VARCHAR(255) NOT NULL,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UQ_users_email" UNIQUE ("email")
);

-- =========================================================
-- PROBLEMS
-- =========================================================

CREATE TABLE "problems" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "title" VARCHAR NOT NULL,

    "description" TEXT NOT NULL,

    "difficulty" problem_difficulty NOT NULL DEFAULT 'MEDIUM',

    "requirements" JSONB NOT NULL,

    "constraints" JSONB,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================================
-- ATTEMPTS
-- =========================================================

CREATE TABLE "attempts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "problemId" UUID NOT NULL,

    "userId" UUID,

    "status" attempt_status NOT NULL DEFAULT 'DRAFT',

    "startedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "submittedAt" TIMESTAMP,

    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_attempts_problem"
        FOREIGN KEY ("problemId")
        REFERENCES "problems"("id")
        ON DELETE CASCADE,

    CONSTRAINT "FK_attempts_user"
        FOREIGN KEY ("userId")
        REFERENCES "users"("id")
        ON DELETE CASCADE
);

-- =========================================================
-- SUBMISSIONS
-- =========================================================

CREATE TABLE "submissions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "attemptId" UUID NOT NULL UNIQUE,

    "type" submission_type NOT NULL DEFAULT 'TEXT',

    "assumptions" TEXT,

    "coreClasses" TEXT,

    "responsibilities" TEXT,

    "relationships" TEXT,

    "abstractions" TEXT,

    "designDecisions" TEXT,

    "extensibility" TEXT,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_submissions_attempt"
        FOREIGN KEY ("attemptId")
        REFERENCES "attempts"("id")
        ON DELETE CASCADE
);


-- =========================================================
-- EVALUATIONS
-- =========================================================

CREATE TABLE "evaluations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "attemptId" UUID NOT NULL UNIQUE,

    "status" evaluation_status NOT NULL DEFAULT 'PENDING',

    "overallScore" DECIMAL(5,2),

    "summary" TEXT,

    "errorMessage" TEXT,

    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FK_evaluations_attempt"
        FOREIGN KEY ("attemptId")
        REFERENCES "attempts"("id")
        ON DELETE CASCADE
);


-- =========================================================
-- FEEDBACK ITEMS
-- =========================================================

CREATE TABLE "feedback_items" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    "criterion" VARCHAR NOT NULL,

    "score" DECIMAL(5,2) NOT NULL,

    "evidence" JSONB NOT NULL DEFAULT '[]'::jsonb,

    "concerns" JSONB NOT NULL DEFAULT '[]'::jsonb,

    "suggestion" TEXT NOT NULL,

    "confidence" DECIMAL(4,2),

    "evaluationId" UUID NOT NULL,

    CONSTRAINT "FK_feedback_items_evaluation"
        FOREIGN KEY ("evaluationId")
        REFERENCES "evaluations"("id")
        ON DELETE CASCADE
);


-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX "IDX_attempts_problemId"
    ON "attempts" ("problemId");

CREATE INDEX "IDX_feedback_items_evaluationId"
    ON "feedback_items" ("evaluationId");

CREATE INDEX "IDX_problems_difficulty"
    ON "problems" ("difficulty");

CREATE INDEX "IDX_attempts_userId"
    ON "attempts" ("userId");

-- =========================================================
-- VERIFY
-- =========================================================

SELECT
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN (
    'users',
    'problems',
    'attempts',
    'submissions',
    'evaluations',
    'feedback_items'
)
ORDER BY table_name, ordinal_position;