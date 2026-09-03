-- CreateTable
CREATE TABLE "Occasion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'FESTIVAL',
    "description" TEXT,
    "badgeText" TEXT,
    "bannerImage" TEXT,
    "accentColor" TEXT DEFAULT '#D4AF37',
    "priority" INTEGER NOT NULL DEFAULT 50,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "calendarKey" TEXT NOT NULL,
    "daysBefore" INTEGER NOT NULL DEFAULT 7,
    "daysAfter" INTEGER NOT NULL DEFAULT 2,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Occasion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FestivalOccurrence" (
    "id" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "displayStart" TIMESTAMP(3) NOT NULL,
    "displayEnd" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'CALENDAR_ENGINE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FestivalOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CakeOccasion" (
    "id" TEXT NOT NULL,
    "cakeId" TEXT NOT NULL,
    "occasionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CakeOccasion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Occasion_slug_key" ON "Occasion"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Occasion_calendarKey_key" ON "Occasion"("calendarKey");

-- CreateIndex
CREATE INDEX "Occasion_active_idx" ON "Occasion"("active");

-- CreateIndex
CREATE INDEX "Occasion_priority_idx" ON "Occasion"("priority");

-- CreateIndex
CREATE INDEX "FestivalOccurrence_year_idx" ON "FestivalOccurrence"("year");

-- CreateIndex
CREATE INDEX "FestivalOccurrence_displayStart_displayEnd_idx" ON "FestivalOccurrence"("displayStart", "displayEnd");

-- CreateIndex
CREATE UNIQUE INDEX "FestivalOccurrence_occasionId_year_key" ON "FestivalOccurrence"("occasionId", "year");

-- CreateIndex
CREATE INDEX "CakeOccasion_cakeId_idx" ON "CakeOccasion"("cakeId");

-- CreateIndex
CREATE INDEX "CakeOccasion_occasionId_idx" ON "CakeOccasion"("occasionId");

-- CreateIndex
CREATE UNIQUE INDEX "CakeOccasion_cakeId_occasionId_key" ON "CakeOccasion"("cakeId", "occasionId");

-- AddForeignKey
ALTER TABLE "FestivalOccurrence" ADD CONSTRAINT "FestivalOccurrence_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CakeOccasion" ADD CONSTRAINT "CakeOccasion_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CakeOccasion" ADD CONSTRAINT "CakeOccasion_occasionId_fkey" FOREIGN KEY ("occasionId") REFERENCES "Occasion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
