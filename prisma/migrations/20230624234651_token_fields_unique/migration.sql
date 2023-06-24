/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `access_tokens` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `refresh_tokens` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "authors" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "libraries" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "series" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "stories" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "active" DROP NOT NULL;

-- AlterTable
ALTER TABLE "volumes" ALTER COLUMN "active" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "access_tokens_token_key" ON "access_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_access_token_idx" ON "refresh_tokens"("access_token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");
