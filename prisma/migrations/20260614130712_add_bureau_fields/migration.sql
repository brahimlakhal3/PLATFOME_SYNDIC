-- AlterTable
ALTER TABLE "Bureau" ADD COLUMN     "etage" INTEGER,
ADD COLUMN     "numeroBureau" SERIAL NOT NULL,
ADD COLUMN     "quotePartCommunes" DOUBLE PRECISION,
ADD COLUMN     "quotePartPrivee" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Set quotePartPrivee to 0 for existing rows
UPDATE "Bureau" SET "quotePartPrivee" = 0 WHERE "quotePartPrivee" IS NULL;

-- AlterTable
ALTER TABLE "Bureau" ALTER COLUMN "quotePartPrivee" DROP DEFAULT;
