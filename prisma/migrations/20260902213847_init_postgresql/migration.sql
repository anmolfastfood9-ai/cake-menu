-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cake" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "ingredients" TEXT,
    "preparationNotes" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "bestseller" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.9,
    "customizationInfo" TEXT DEFAULT 'Custom message on chocolate plaque, shape customization & tiered sizing available on request.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CakePrice" (
    "id" TEXT NOT NULL,
    "cakeId" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "originalPrice" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CakePrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageMedia" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "filename" TEXT NOT NULL,
    "size" INTEGER DEFAULT 0,
    "mimeType" TEXT DEFAULT 'image/jpeg',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "restaurantName" TEXT NOT NULL DEFAULT 'Sweet Delights',
    "tagline" TEXT NOT NULL DEFAULT 'HAUTE PÂTISSERIE • 100% EGGLESS',
    "logo" TEXT DEFAULT 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop',
    "heroTitle" TEXT NOT NULL DEFAULT 'Every Celebration Deserves Something Beautiful.',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Handcrafted eggless cakes, made fresh for your special moments. Browse our curated digital collection and order directly on WhatsApp.',
    "heroImage" TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
    "about" TEXT NOT NULL DEFAULT 'At Sweet Delights, every creation is an edible work of art. We are strictly 100% Eggless & Pure Vegetarian, combining age-old French confectionery techniques with the finest Belgian cocoa, pure Madagascar vanilla, and fresh dairy butter.',
    "phone" TEXT NOT NULL DEFAULT '+91 98765 43210',
    "whatsapp" TEXT NOT NULL DEFAULT '919876543210',
    "address" TEXT NOT NULL DEFAULT '123, Bakery Promenade, Haute Pâtisserie District, Patna, Bihar, India',
    "openingHours" TEXT NOT NULL DEFAULT 'Monday - Sunday: 10:00 AM – 10:00 PM',
    "instagram" TEXT DEFAULT 'https://instagram.com/sweetdelightscakes',
    "facebook" TEXT DEFAULT 'https://facebook.com/sweetdelightscakes',
    "footerText" TEXT NOT NULL DEFAULT '© 2026 Sweet Delights. 100% Eggless • Pure Vegetarian Confectionery.',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppSetting" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "whatsappNumber" TEXT NOT NULL DEFAULT '919876543210',
    "defaultMessageTemplate" TEXT NOT NULL DEFAULT 'Hello Sweet Delights, I would like to enquire about:

🍰 *Cake:* {cake_name}
⚖️ *Weight:* {weight}
💰 *Price:* ₹{price}

Please confirm availability and preparation time.',
    "callNumber" TEXT NOT NULL DEFAULT '+919876543210',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_displayOrder_idx" ON "Category"("displayOrder");

-- CreateIndex
CREATE INDEX "Category_active_idx" ON "Category"("active");

-- CreateIndex
CREATE UNIQUE INDEX "Cake_slug_key" ON "Cake"("slug");

-- CreateIndex
CREATE INDEX "Cake_categoryId_idx" ON "Cake"("categoryId");

-- CreateIndex
CREATE INDEX "Cake_available_idx" ON "Cake"("available");

-- CreateIndex
CREATE INDEX "Cake_available_featured_bestseller_idx" ON "Cake"("available", "featured", "bestseller");

-- CreateIndex
CREATE INDEX "CakePrice_cakeId_idx" ON "CakePrice"("cakeId");

-- CreateIndex
CREATE INDEX "ImageMedia_createdAt_idx" ON "ImageMedia"("createdAt");

-- AddForeignKey
ALTER TABLE "Cake" ADD CONSTRAINT "Cake_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CakePrice" ADD CONSTRAINT "CakePrice_cakeId_fkey" FOREIGN KEY ("cakeId") REFERENCES "Cake"("id") ON DELETE CASCADE ON UPDATE CASCADE;
