/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `scenarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "scenarios_title_key" ON "scenarios"("title");
