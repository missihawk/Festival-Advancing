/*
  Warnings:

  - You are about to drop the column `date` on the `Act` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Act` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Stage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 100,
    "color" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ActTimeSlot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "actId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "start" DATETIME NOT NULL,
    "end" DATETIME,
    "stageId" INTEGER,
    "notes" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActTimeSlot_actId_fkey" FOREIGN KEY ("actId") REFERENCES "Act" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActTimeSlot_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Act" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "festival_producer" TEXT,
    "festival_booker" TEXT,
    "show_time" DATETIME,
    "stageId" INTEGER,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Act_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "Stage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Act" ("id", "name") SELECT "id", "name" FROM "Act";
DROP TABLE "Act";
ALTER TABLE "new_Act" RENAME TO "Act";
CREATE INDEX "Act_show_time_idx" ON "Act"("show_time");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Stage_name_key" ON "Stage"("name");

-- CreateIndex
CREATE INDEX "ActTimeSlot_actId_start_idx" ON "ActTimeSlot"("actId", "start");

-- CreateIndex
CREATE INDEX "ActTimeSlot_type_idx" ON "ActTimeSlot"("type");
