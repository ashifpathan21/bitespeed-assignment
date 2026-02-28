-- CreateEnum
CREATE TYPE "precedence" AS ENUM ('PRIMARY', 'SECONDARY');

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT,
    "email" TEXT,
    "linkedId" INTEGER,
    "linkPrecedence" "precedence" NOT NULL DEFAULT 'PRIMARY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Contact_deletedAt_idx" ON "Contact"("deletedAt");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_linkedId_fkey" FOREIGN KEY ("linkedId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;
