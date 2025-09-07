/*
  Warnings:

  - You are about to drop the column `bucketKey` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Product_bucketKey_key";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "bucketKey";

-- CreateTable
CREATE TABLE "public"."ProductImage" (
    "id" SERIAL NOT NULL,
    "bucketKey" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_bucketKey_key" ON "public"."ProductImage"("bucketKey");

-- AddForeignKey
ALTER TABLE "public"."ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
