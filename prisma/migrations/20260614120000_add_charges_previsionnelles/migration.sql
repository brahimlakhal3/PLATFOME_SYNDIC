-- Delete existing rows to avoid conflicts with new required columns
DELETE FROM "Charge";

-- AlterTable
ALTER TABLE "Charge" DROP CONSTRAINT IF EXISTS "Charge_annee_type_key";
ALTER TABLE "Charge" DROP COLUMN "type",
DROP COLUMN "montant";
ALTER TABLE "Charge" ADD COLUMN "imageUrl" TEXT,
ADD COLUMN "libelle" TEXT NOT NULL,
ADD COLUMN "montantAnnuel" DOUBLE PRECISION,
ADD COLUMN "montantMensuel" DOUBLE PRECISION,
ADD COLUMN "typeFixe" BOOLEAN NOT NULL DEFAULT true;
