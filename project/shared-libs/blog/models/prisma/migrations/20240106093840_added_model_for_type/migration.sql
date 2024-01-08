/*
  Warnings:

  - You are about to drop the column `type` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "type";

-- CreateTable
CREATE TABLE "types" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PostToType" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "types_title_idx" ON "types"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_PostToType_AB_unique" ON "_PostToType"("A", "B");

-- CreateIndex
CREATE INDEX "_PostToType_B_index" ON "_PostToType"("B");

-- AddForeignKey
ALTER TABLE "_PostToType" ADD CONSTRAINT "_PostToType_A_fkey" FOREIGN KEY ("A") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PostToType" ADD CONSTRAINT "_PostToType_B_fkey" FOREIGN KEY ("B") REFERENCES "types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
