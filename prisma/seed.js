const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Sweet Delights Pixel-Perfect Blueprint Database...");

  // 1. Create Default Admin from secure environment variables
  const adminEmail = process.env.ADMIN_EMAIL || "admin@sweetdelights.com";
  const rawPassword = process.env.ADMIN_INITIAL_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!rawPassword && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_INITIAL_PASSWORD or ADMIN_PASSWORD must be provided in production environment!");
  }

  const passwordToHash = rawPassword || "SweetDelights@2026!LuxuryMenu";
  const hashedPassword = await bcrypt.hash(passwordToHash, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, name: "Sweet Delights Pastry Chef" },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Sweet Delights Pastry Chef",
    },
  });
  console.log("👤 Admin user configured:", admin.email);

  // 2. Default Website Settings
  await prisma.websiteSetting.upsert({
    where: { id: "default" },
    update: {
      restaurantName: "Sweet Delights",
      tagline: "100% EGGLESS • PURE VEGETARIAN",
      heroTitle: "Digital Cake Menu",
      heroSubtitle: "Handcrafted eggless cakes, made for every celebration.",
      heroImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
      about: "Every cake is handcrafted with love using the finest ingredients. Thank you for supporting local! 🤎",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      address: "123, Bakery Street, Patna, Bihar 800001",
      openingHours: "10:00 AM – 10:00 PM (All Days)",
      instagram: "https://instagram.com/sweetdelights.cakes",
      facebook: "https://facebook.com/sweetdelightscakes",
      footerText: "© 2026 Sweet Delights. All rights reserved. 100% Eggless • Pure Vegetarian.",
    },
    create: {
      id: "default",
      restaurantName: "Sweet Delights",
      tagline: "100% EGGLESS • PURE VEGETARIAN",
      logo: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=200&auto=format&fit=crop",
      heroTitle: "Digital Cake Menu",
      heroSubtitle: "Handcrafted eggless cakes, made for every celebration.",
      heroImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop",
      about: "Every cake is handcrafted with love using the finest ingredients. Thank you for supporting local! 🤎",
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      address: "123, Bakery Street, Patna, Bihar 800001",
      openingHours: "10:00 AM – 10:00 PM (All Days)",
      instagram: "https://instagram.com/sweetdelights.cakes",
      facebook: "https://facebook.com/sweetdelightscakes",
      footerText: "© 2026 Sweet Delights. All rights reserved. 100% Eggless • Pure Vegetarian.",
    },
  });

  // 3. WhatsApp Settings
  await prisma.whatsAppSetting.upsert({
    where: { id: "default" },
    update: {
      whatsappNumber: "919876543210",
      defaultMessageTemplate: "Hello, I would like to enquire about:\n\n🍰 *{cake_name}*\n⚖️ *Weight:* {weight}\n💰 *Price:* ₹{price}\n\nPlease confirm availability and preparation time.",
      callNumber: "+919876543210",
      isEnabled: true,
    },
    create: {
      id: "default",
      whatsappNumber: "919876543210",
      defaultMessageTemplate: "Hello, I would like to enquire about:\n\n🍰 *{cake_name}*\n⚖️ *Weight:* {weight}\n💰 *Price:* ₹{price}\n\nPlease confirm availability and preparation time.",
      callNumber: "+919876543210",
      isEnabled: true,
    },
  });

  // 4. Categories matching Master Blueprint
  const categoriesData = [
    {
      name: "Chocolate",
      slug: "chocolate",
      description: "Decadent dark chocolate ganaches and Belgian truffles.",
      displayOrder: 1,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Fruit & Berry",
      slug: "fruit-berry",
      description: "Fresh berries, alphonso mango, and tropical purees.",
      displayOrder: 2,
      image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Birthday",
      slug: "birthday",
      description: "Celebration showstoppers crafted for joyous birthdays.",
      displayOrder: 3,
      image: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Premium",
      slug: "premium",
      description: "Artisanal luxury cakes with 24K gold and rare cocoa.",
      displayOrder: 4,
      image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Photo Cakes",
      slug: "photo-cakes",
      description: "High-definition edible sugar sheet photo prints.",
      displayOrder: 5,
      image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Designer Cakes",
      slug: "designer-cakes",
      description: "Bespoke tiered creations and floral themes.",
      displayOrder: 6,
      image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=400&auto=format&fit=crop",
    },
    {
      name: "Anniversary",
      slug: "anniversary",
      description: "Romantic scarlet velvets and heart-crafted bakes.",
      displayOrder: 7,
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400&auto=format&fit=crop",
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }

  // 5. 12 Master Blueprint Cakes
  const cakesData = [
    {
      name: "Chocolate Truffle",
      slug: "chocolate-truffle",
      categorySlug: "chocolate",
      description: "Rich chocolate sponge layered with silky chocolate ganache and chocolate truffle. A perfect treat for chocolate lovers.",
      coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Cocoa Powder, Dark Chocolate, Fresh Cream, Milk, Sugar, Refined Flour, Chocolate Truffle & more.",
      preparationNotes: "Keep refrigerated. Best enjoyed within 2 days.",
      featured: true,
      bestseller: true,
      isNew: false,
      available: true,
      rating: 4.8,
      prices: [
        { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false },
        { weight: "1 kg", price: 1399, originalPrice: 1599, isDefault: true },
        { weight: "1.5 kg", price: 1899, originalPrice: 2199, isDefault: false },
        { weight: "2 kg", price: 2499, originalPrice: 2899, isDefault: false },
      ],
    },
    {
      name: "Red Velvet",
      slug: "red-velvet",
      categorySlug: "anniversary",
      description: "Classic red velvet with cream cheese frosting.",
      coverImage: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Philadelphia Cream Cheese, Cocoa Sponge, Madagascar Vanilla, Pure Dairy Cream",
      preparationNotes: "Keep refrigerated. Best enjoyed within 2 days.",
      featured: true,
      bestseller: false,
      isNew: true,
      available: true,
      rating: 4.8,
      prices: [
        { weight: "0.5 kg", price: 849, originalPrice: 949, isDefault: false },
        { weight: "1 kg", price: 1499, originalPrice: 1699, isDefault: true },
        { weight: "1.5 kg", price: 1999, originalPrice: 2299, isDefault: false },
        { weight: "2 kg", price: 2599, originalPrice: 2999, isDefault: false },
      ],
    },
    {
      name: "Pistachio Rose",
      slug: "pistachio-rose",
      categorySlug: "premium",
      description: "Pistachio sponge with rose cream & pistachio crunch.",
      coverImage: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop", // Fallback will use local / unsp
      coverImage: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Roasted Iranian Pistachios, Damascus Rose Water, Dairy Sponge, Whipped Cream",
      preparationNotes: "Keep chilled. Best served fresh.",
      featured: true,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.9,
      prices: [
        { weight: "0.5 kg", price: 899, originalPrice: 999, isDefault: false },
        { weight: "1 kg", price: 1599, originalPrice: 1799, isDefault: true },
        { weight: "1.5 kg", price: 2199, originalPrice: 2499, isDefault: false },
        { weight: "2 kg", price: 2799, originalPrice: 3199, isDefault: false },
      ],
    },
    {
      name: "Wild Berry & Madagascar",
      slug: "wild-berry-madagascar",
      categorySlug: "fruit-berry",
      description: "Vanilla sponge with mixed berries & cream.",
      coverImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Fresh Strawberries, Blueberries, Raspberries, Madagascar Bourbon Vanilla, Sponge",
      preparationNotes: "Keep chilled. Serve fresh.",
      featured: true,
      bestseller: true,
      isNew: false,
      available: true,
      rating: 4.9,
      prices: [
        { weight: "0.5 kg", price: 1149, originalPrice: 1299, isDefault: false },
        { weight: "1 kg", price: 1899, originalPrice: 2199, isDefault: true },
        { weight: "1.5 kg", price: 2599, originalPrice: 2899, isDefault: false },
        { weight: "2 kg", price: 3299, originalPrice: 3699, isDefault: false },
      ],
    },
    {
      name: "Mango Delight",
      slug: "mango-delight",
      categorySlug: "fruit-berry",
      description: "Mango sponge with mango mousse & mango glaze.",
      coverImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Ratnagiri Alphonso Mango Puree, Whipped Dairy Cream, Vanilla Sponge, Mango Glaze",
      preparationNotes: "Keep refrigerated. Best enjoyed within 2 days.",
      featured: true,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.8,
      prices: [
        { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false },
        { weight: "1 kg", price: 1399, originalPrice: 1599, isDefault: true },
        { weight: "1.5 kg", price: 1899, originalPrice: 2199, isDefault: false },
        { weight: "2 kg", price: 2499, originalPrice: 2899, isDefault: false },
      ],
    },
    {
      name: "Belgian Dark Chocolate",
      slug: "belgian-dark-chocolate",
      categorySlug: "chocolate",
      description: "Luxurious belgian chocolate for true chocolate lovers.",
      coverImage: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "70% Single Origin Belgian Dark Chocolate, Organic Cocoa Sponge, French Butter, Truffle Ganache",
      preparationNotes: "Keep refrigerated.",
      featured: false,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.9,
      prices: [
        { weight: "0.5 kg", price: 899, originalPrice: 999, isDefault: false },
        { weight: "1 kg", price: 1599, originalPrice: 1799, isDefault: true },
        { weight: "1.5 kg", price: 2199, originalPrice: 2499, isDefault: false },
        { weight: "2 kg", price: 2799, originalPrice: 3199, isDefault: false },
      ],
    },
    {
      name: "Chocolate Hazelnut",
      slug: "chocolate-hazelnut",
      categorySlug: "chocolate",
      description: "Chocolate sponge with hazelnut praline crunch.",
      coverImage: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Piedmont Roasted Hazelnuts, Nutella Ganache, Cocoa Sponge, Crispy Wafer Feuilletine",
      preparationNotes: "Keep refrigerated.",
      featured: false,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.8,
      prices: [
        { weight: "0.5 kg", price: 899, originalPrice: 999, isDefault: false },
        { weight: "1 kg", price: 1599, originalPrice: 1799, isDefault: true },
        { weight: "1.5 kg", price: 2199, originalPrice: 2499, isDefault: false },
        { weight: "2 kg", price: 2799, originalPrice: 3199, isDefault: false },
      ],
    },
    {
      name: "Black Forest",
      slug: "black-forest",
      categorySlug: "birthday",
      description: "Traditional german chocolate sponge with whipped cream.",
      coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Red Sour Cherries, Whipped Dairy Cream, Chocolate Shavings, Cocoa Sponge",
      preparationNotes: "Fresh bake daily.",
      featured: false,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.7,
      prices: [
        { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false },
        { weight: "1 kg", price: 1399, originalPrice: 1599, isDefault: true },
        { weight: "1.5 kg", price: 1899, originalPrice: 2199, isDefault: false },
        { weight: "2 kg", price: 2499, originalPrice: 2899, isDefault: false },
      ],
    },
    {
      name: "Lotus Biscoff Salted Caramel",
      slug: "lotus-biscoff-caramel",
      categorySlug: "birthday",
      description: "Layered spiced speculoos sponge with salted caramel drip.",
      coverImage: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Lotus Biscoff Spread, Speculoos Crumb, Salted Caramel, Dairy Buttercream",
      preparationNotes: "Keep refrigerated.",
      featured: false,
      bestseller: false,
      isNew: true,
      available: true,
      rating: 4.85,
      prices: [
        { weight: "0.5 kg", price: 799, originalPrice: 899, isDefault: false },
        { weight: "1 kg", price: 1499, originalPrice: 1699, isDefault: true },
        { weight: "1.5 kg", price: 2099, originalPrice: 2399, isDefault: false },
        { weight: "2 kg", price: 2699, originalPrice: 2999, isDefault: false },
      ],
    },
    {
      name: "Eggless Blueberry Cheesecake",
      slug: "blueberry-cheesecake",
      categorySlug: "premium",
      description: "Silky Philadelphia cream cheese mousse over graham crust.",
      coverImage: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Philadelphia Cream Cheese, Graham Cracker Crust, Wild Blueberries Compote",
      preparationNotes: "Chilled dessert.",
      featured: false,
      bestseller: true,
      isNew: false,
      available: true,
      rating: 4.9,
      prices: [
        { weight: "0.5 kg", price: 899, originalPrice: 999, isDefault: false },
        { weight: "1 kg", price: 1599, originalPrice: 1799, isDefault: true },
        { weight: "1.5 kg", price: 2299, originalPrice: 2599, isDefault: false },
        { weight: "2 kg", price: 2999, originalPrice: 3299, isDefault: false },
      ],
    },
    {
      name: "Custom Bespoke Photo Cake",
      slug: "custom-photo-cake",
      categorySlug: "photo-cakes",
      description: "High-definition edible sugar sheet photo print cake.",
      coverImage: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "Edible Sugar Sheet, Natural Food Ink, Fresh Vanilla / Chocolate Cake Base",
      preparationNotes: "Custom photo print notice 4 hours.",
      featured: false,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 4.8,
      prices: [
        { weight: "1 kg", price: 1599, originalPrice: 1799, isDefault: true },
        { weight: "1.5 kg", price: 2299, originalPrice: 2499, isDefault: false },
        { weight: "2 kg", price: 2999, originalPrice: 3299, isDefault: false },
      ],
    },
    {
      name: "24K Royal Gold Truffle",
      slug: "24k-royal-gold-truffle",
      categorySlug: "premium",
      description: "70% dark chocolate ganache finished with genuine 24K gold leaf.",
      coverImage: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000&auto=format&fit=crop",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=1000&auto=format&fit=crop"
      ]),
      ingredients: "70% Single Origin Cocoa, Edible 24K Gold Leaf, Piedmont Hazelnuts, Normandy Butter",
      preparationNotes: "Artisanal signature creation.",
      featured: true,
      bestseller: false,
      isNew: false,
      available: true,
      rating: 5.0,
      prices: [
        { weight: "0.5 kg", price: 1299, originalPrice: 1499, isDefault: false },
        { weight: "1 kg", price: 2399, originalPrice: 2699, isDefault: true },
        { weight: "1.5 kg", price: 3499, originalPrice: 3899, isDefault: false },
        { weight: "2 kg", price: 4499, originalPrice: 4999, isDefault: false },
      ],
    },
  ];

  for (const item of cakesData) {
    const categoryId = categoryMap[item.categorySlug];
    if (!categoryId) continue;

    const { categorySlug, prices, ...cakeFields } = item;

    const existing = await prisma.cake.findUnique({ where: { slug: cakeFields.slug } });
    if (existing) {
      await prisma.cakePrice.deleteMany({ where: { cakeId: existing.id } });
      await prisma.cake.delete({ where: { id: existing.id } });
    }

    const createdCake = await prisma.cake.create({
      data: {
        ...cakeFields,
        categoryId,
        prices: {
          create: prices,
        },
      },
    });

    console.log(`🎂 Cake created: ${createdCake.name}`);
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
