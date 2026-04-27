/*
  Warnings:

  - The values [NEVER_DONATED,MAJOR_DONOR] on the enum `ProspectHistory` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `name` on the `prospect_personas` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `prospect_personas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `prospect_personas` table without a default value. This is not possible if the table is not empty.
  - Made the column `graduationYear` on table `prospect_personas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `degree` on table `prospect_personas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProspectHistory_new" AS ENUM ('ACQUISITION', 'LAPSED', 'ANNUAL_DONOR', 'LEADERSHIP_DONOR', 'UNKNOWN');
ALTER TABLE "prospect_personas" ALTER COLUMN "prospectHistory" TYPE "ProspectHistory_new" USING ("prospectHistory"::text::"ProspectHistory_new");
ALTER TYPE "ProspectHistory" RENAME TO "ProspectHistory_old";
ALTER TYPE "ProspectHistory_new" RENAME TO "ProspectHistory";
DROP TYPE "public"."ProspectHistory_old";
COMMIT;

-- AlterTable
ALTER TABLE "prospect_personas" DROP COLUMN "name",
ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "postalcode" TEXT,
ADD COLUMN     "province" TEXT,
ALTER COLUMN "graduationYear" SET NOT NULL,
ALTER COLUMN "degree" SET NOT NULL;
