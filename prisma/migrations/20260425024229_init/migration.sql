-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TRAINEE', 'COACH', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProspectHistory" AS ENUM ('NEVER_DONATED', 'LAPSED', 'ANNUAL_DONOR', 'MAJOR_DONOR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AskRange" AS ENUM ('UNDER_100', 'RANGE_100_500', 'RANGE_500_2500', 'OVER_2500');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'ERROR');

-- CreateEnum
CREATE TYPE "Speaker" AS ENUM ('REP', 'PROSPECT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TRAINEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospect_personas" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER,
    "graduationYear" INTEGER,
    "degree" TEXT,
    "currentRole" TEXT,
    "city" TEXT,
    "personality" TEXT NOT NULL,
    "backstory" TEXT NOT NULL,
    "prospectHistory" "ProspectHistory" NOT NULL,
    "likelyObjections" TEXT[],
    "triggerTopics" TEXT[],
    "targetAskRange" "AskRange" NOT NULL,
    "personaJson" JSONB NOT NULL,

    CONSTRAINT "prospect_personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'INTERMEDIATE',
    "focusSkills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_personas" (
    "scenarioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,

    CONSTRAINT "scenario_personas_pkey" PRIMARY KEY ("scenarioId","personaId")
);

-- CreateTable
CREATE TABLE "call_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "scenarioId" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "realtimeSessionId" TEXT,
    "status" "SessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "durationSec" INTEGER,
    "audioUrl" TEXT,

    CONSTRAINT "call_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transcript_segments" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "speaker" "Speaker" NOT NULL,
    "text" TEXT NOT NULL,
    "startMs" INTEGER NOT NULL,
    "endMs" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "transcript_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_reports" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overallScore" DOUBLE PRECISION NOT NULL,
    "rapportScore" DOUBLE PRECISION NOT NULL,
    "objectionsScore" DOUBLE PRECISION NOT NULL,
    "askScore" DOUBLE PRECISION NOT NULL,
    "listeningScore" DOUBLE PRECISION NOT NULL,
    "strengths" TEXT[],
    "areasForImprovement" TEXT[],
    "coachingTips" TEXT[],
    "feedback" TEXT NOT NULL,
    "objectionsEncountered" TEXT[],
    "askMade" BOOLEAN NOT NULL DEFAULT false,
    "askAccepted" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prospect_personas_externalId_key" ON "prospect_personas"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "call_sessions_realtimeSessionId_key" ON "call_sessions"("realtimeSessionId");

-- CreateIndex
CREATE INDEX "transcript_segments_sessionId_order_idx" ON "transcript_segments"("sessionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_reports_sessionId_key" ON "evaluation_reports"("sessionId");

-- AddForeignKey
ALTER TABLE "scenario_personas" ADD CONSTRAINT "scenario_personas_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_personas" ADD CONSTRAINT "scenario_personas_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "prospect_personas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "call_sessions" ADD CONSTRAINT "call_sessions_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "prospect_personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transcript_segments" ADD CONSTRAINT "transcript_segments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "call_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_reports" ADD CONSTRAINT "evaluation_reports_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "call_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_reports" ADD CONSTRAINT "evaluation_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
