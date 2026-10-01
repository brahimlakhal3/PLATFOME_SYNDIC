/*
  Warnings:

  - Added the required column `syndicId` to the `Bureau` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syndicId` to the `Charge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syndicId` to the `Depense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syndicId` to the `GroupMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syndicId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bureau" ADD COLUMN     "syndicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "syndicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Depense" ADD COLUMN     "syndicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GroupMessage" ADD COLUMN     "syndicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "syndicId" TEXT;

-- AlterTable
ALTER TABLE "Vote" ADD COLUMN     "syndicId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bureau" ADD CONSTRAINT "Bureau_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Depense" ADD CONSTRAINT "Depense_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMessage" ADD CONSTRAINT "GroupMessage_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_syndicId_fkey" FOREIGN KEY ("syndicId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
