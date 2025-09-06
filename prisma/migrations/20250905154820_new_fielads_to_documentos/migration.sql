-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "attention" TEXT,
ADD COLUMN     "audiences" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "intent" TEXT,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "path" TEXT,
ADD COLUMN     "taxonomy" TEXT;
