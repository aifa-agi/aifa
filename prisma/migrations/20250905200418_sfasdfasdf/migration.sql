/*
  Warnings:

  - The primary key for the `Document` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attention` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `audiences` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `intent` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `keywordId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `structure` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `taxonomy` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Keyword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `documentCreatedAt` to the `Suggestion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_keywordId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Suggestion" DROP CONSTRAINT "Suggestion_documentId_fkey";

-- DropIndex
DROP INDEX "Document_userId_idx";

-- DropIndex
DROP INDEX "Suggestion_documentId_idx";

-- AlterTable
ALTER TABLE "Document" DROP CONSTRAINT "Document_pkey",
DROP COLUMN "attention",
DROP COLUMN "audiences",
DROP COLUMN "categoryId",
DROP COLUMN "description",
DROP COLUMN "intent",
DROP COLUMN "keywordId",
DROP COLUMN "order",
DROP COLUMN "path",
DROP COLUMN "structure",
DROP COLUMN "tagId",
DROP COLUMN "taxonomy",
DROP COLUMN "updatedAt",
ALTER COLUMN "createdAt" DROP DEFAULT,
ADD CONSTRAINT "Document_pkey" PRIMARY KEY ("id", "createdAt");

-- AlterTable
ALTER TABLE "Suggestion" ADD COLUMN     "documentCreatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Keyword";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT[],
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "image" TEXT,
    "design" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSection" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sectionPath" TEXT[],
    "summary" TEXT,
    "type" TEXT NOT NULL,
    "className" TEXT,
    "headerContent" JSONB,
    "bodyContent" JSONB,
    "footerContent" JSONB,
    "videoUrl" TEXT,
    "imageUrl" TEXT,
    "sectionClassName" TEXT,
    "contentWrapperClassName" TEXT,
    "customComponentsAnyTypeData" JSONB,

    CONSTRAINT "PageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageSetting" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageSetting_pageId_idx" ON "PageSetting"("pageId");

-- AddForeignKey
ALTER TABLE "Suggestion" ADD CONSTRAINT "Suggestion_documentId_documentCreatedAt_fkey" FOREIGN KEY ("documentId", "documentCreatedAt") REFERENCES "Document"("id", "createdAt") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PageSection" ADD CONSTRAINT "PageSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageSetting" ADD CONSTRAINT "PageSetting_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "Page"("id") ON DELETE CASCADE ON UPDATE CASCADE;
