/*
  Warnings:

  - You are about to drop the `Page` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageSection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PageSection" DROP CONSTRAINT "PageSection_pageId_fkey";

-- DropForeignKey
ALTER TABLE "PageSetting" DROP CONSTRAINT "PageSetting_pageId_fkey";

-- DropTable
DROP TABLE "Page";

-- DropTable
DROP TABLE "PageSection";

-- DropTable
DROP TABLE "PageSetting";
