-- AlterTable
ALTER TABLE "Cake" ADD COLUMN     "productType" TEXT NOT NULL DEFAULT 'CAKE';

-- AlterTable
ALTER TABLE "CakePrice" ADD COLUMN     "images" TEXT NOT NULL DEFAULT '[]';

-- CreateTable
CREATE TABLE "OccasionCategory" (
    "id" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OccasionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OccasionCategoryCake" (
    "id" TEXT NOT NULL,
    "occasionCategoryId" TEXT NOT NULL,
    "cakeId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OccasionCategoryCake_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OccasionCategory_occasionId_idx" ON "OccasionCategory"("occasionId");

-- CreateIndex
CREATE INDEX "OccasionCategory_displayOrder_idx" ON "OccasionCategory"("displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "OccasionCategory_occasionId_slug_key" ON "OccasionCategory"("occasionId", "slug");

-- CreateIndex
CREATE INDEX "OccasionCategoryCake_occasionCategoryId_idx" ON "OccasionCategoryCake"("occasionCategoryId");

-- CreateIndex
CREATE INDEX "OccasionCategoryCake_cakeId_idx" ON "OccasionCategoryCake"("cakeId");

-- CreateIndex
CREATE UNIQUE INDEX "OccasionCategoryCake_occasionCategoryId_cakeId_key" ON "OccasionCategoryCake"("occasionCategoryId", "cakeId");

-- CreateIndex
CREATE INDEX "Cake_productType_idx" ON "Cake"("productType");

-- CreateIndex
CREATE INDEX "CakePrice_cakeId_price_idx" ON "CakePrice"("cakeId", "price");

-- AddForeignKey
ALTER TABLE "OccasionCategory" ADD CONSTRAINT "OccasionCategory_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionCategoryCake" ADD CONSTRAINT "OccasionCategoryCake_occasionCategoryId_fkey" FOREIGN KEY ("occasionCategoryId") REFERENCES "OccasionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OccasionCategoryCake" ADD CONSTRAINT "OccasionCategoryCake_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
