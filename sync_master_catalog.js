/**
 * RAMAN SWEET BAKERY — PRODUCTION-SAFE MASTER CATALOG SYNC
 * 
 * Supports:
 *   node sync_master_catalog.js --dry-run
 *   node sync_master_catalog.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const isDryRun = process.argv.includes('--dry-run');

// ==========================================
// 1. FINAL APPROVED CATEGORY SPECIFICATION
// ==========================================
const TARGET_CATEGORIES = [
  { order: 1, name: "Classic Cakes", slug: "classic-cakes", legacySlugs: ["classic-cakes"] },
  { order: 2, name: "Chocolate Cakes", slug: "chocolate-cakes", legacySlugs: ["chocolate-cakes"] },
  { order: 3, name: "Fruit, Jelly & Fresh Cream", slug: "fruit-jelly-fresh-cream", legacySlugs: ["fruit-fresh-cream"] },
  { order: 4, name: "Red Velvet & Premium", slug: "red-velvet-premium", legacySlugs: ["red-velvet-premium"] },
  { order: 5, name: "Heart, Doll & Designer Cakes", slug: "heart-doll-designer", legacySlugs: ["designer-photo-cakes"] },
  { order: 6, name: "Photo & Theme Cakes", slug: "photo-theme-cakes", legacySlugs: [] },
  { order: 7, name: "Mini & Bento Cakes", slug: "mini-bento-cakes", legacySlugs: ["mini-bento-cakes"] },
  { order: 8, name: "Fusion & Indian Flavours", slug: "fusion-indian-flavours", legacySlugs: ["fusion-cakes"] },
  { order: 9, name: "Large & Celebration Cakes", slug: "large-celebration-cakes", legacySlugs: ["large-celebration-cakes"] },
];

// ==========================================
// 2. TARGET 34 PUBLIC CAKES SPECIFICATION
// ==========================================
const TARGET_34_CAKES = [
  // --- CLASSIC CAKES ---
  {
    num: 1,
    name: "Black Forest Cake",
    targetSlug: "black-forest",
    targetCategorySlug: "classic-cakes",
    legacySlugs: ["black-forest"],
    description: "Classic chocolate sponge layered with smooth cream and cherry filling, finished with delicate chocolate shavings.",
    ingredients: "Chocolate sponge, fresh cream, cherry filling, chocolate shavings",
    editorialQuote: "A timeless chocolate classic made for simple, joyful celebrations.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 2,
    name: "Vanilla Fresh Cream Cake",
    targetSlug: "vanilla-fresh-cream",
    targetCategorySlug: "classic-cakes",
    legacySlugs: ["vanilla-fresh-cream"],
    description: "Light vanilla sponge layered with smooth fresh cream for a simple, elegant and versatile celebration cake.",
    ingredients: "Vanilla sponge, fresh cream, vanilla flavour",
    editorialQuote: "Soft, simple and elegant for every kind of celebration.",
    displayRating: 4.7,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 3,
    name: "White Forest Cake",
    targetSlug: "white-forest",
    targetCategorySlug: "classic-cakes",
    legacySlugs: ["white-forest"],
    description: "Soft vanilla sponge with fresh cream and white chocolate accents for a delicate forest-style celebration cake.",
    ingredients: "Vanilla sponge, fresh cream, white chocolate",
    editorialQuote: "Delicate, creamy and beautifully suited to elegant celebrations.",
    displayRating: 4.7,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 4,
    name: "Butterscotch Cake",
    targetSlug: "butterscotch-cake",
    targetCategorySlug: "classic-cakes",
    legacySlugs: ["butterscotch-cake", "butterscotch"],
    description: "Soft vanilla sponge layered with smooth cream and crunchy butterscotch for a familiar caramel-inspired finish.",
    ingredients: "Vanilla sponge, fresh cream, butterscotch crunch, caramel flavour",
    editorialQuote: "Sweet caramel notes and gentle crunch in every celebratory slice.",
    displayRating: 4.7,
    ratingLabel: "Bakery Favourite",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
    verifiedPrices: [
      { weight: "0.5 kg", price: 699, originalPrice: 799, isDefault: true },
      { weight: "1 kg", price: 1249, originalPrice: 1399, isDefault: false },
      { weight: "1.5 kg", price: 1799, originalPrice: 1999, isDefault: false },
      { weight: "2 kg", price: 2349, originalPrice: 2599, isDefault: false },
    ]
  },

  // --- CHOCOLATE CAKES ---
  {
    num: 5,
    name: "Belgian Chocolate Truffle",
    targetSlug: "belgian-chocolate-truffle",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["belgian-dark-chocolate-ganache"],
    description: "Decadent dark chocolate sponge layered with rich artisanal Belgian ganache and a velvety smooth finish.",
    ingredients: "Belgian dark chocolate, cocoa sponge, fresh dairy cream, chocolate ganache",
    editorialQuote: "Intensely rich Belgian cocoa for true dark chocolate connoisseurs.",
    displayRating: 4.9,
    ratingLabel: "Bakery Favourite",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 6,
    name: "Ferrero Rocher Chocolate Cake",
    targetSlug: "ferrero-rocher-chocolate-cake",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["ferrero-rocher"],
    description: "Signature chocolate hazelnut sponge filled with crispy wafers, chocolate cream and crushed Ferrero Rocher.",
    ingredients: "Roasted hazelnuts, crispy wafers, chocolate sponge, hazelnut praline",
    editorialQuote: "Crunchy hazelnut praline enveloped in silky chocolate ganache.",
    displayRating: 4.9,
    ratingLabel: "Popular Choice",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 7,
    name: "Chocolate Truffle Cake",
    targetSlug: "chocolate-truffle",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["chocolate-truffle"],
    description: "Pure chocolate luxury with moist dark sponge and layered silky chocolate truffle cream throughout.",
    ingredients: "Dark chocolate, cocoa sponge, rich dairy cream, chocolate truffle glaze",
    editorialQuote: "Every slice melts into luxurious, silky dark chocolate bliss.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 8,
    name: "Chocolate Hazelnut Cake",
    targetSlug: "chocolate-hazelnut",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["chocolate-hazelnut"],
    description: "Delicate chocolate layers blended with smooth hazelnut paste and fine roasted nut pieces for a nutty crunch.",
    ingredients: "Roasted hazelnuts, cocoa sponge, hazelnut paste, chocolate cream",
    editorialQuote: "Nutty roasted hazelnut goodness folded into premium cocoa.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 9,
    name: "Lotus Biscoff Caramel Cake",
    targetSlug: "lotus-biscoff-caramel",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["lotus-biscoff-salted-caramel"],
    description: "Spiced caramelised biscuit sponge paired with rich Biscoff spread and layered caramel cream frosting.",
    ingredients: "Lotus Biscoff spread, speculoos biscuits, caramel cream, vanilla sponge",
    editorialQuote: "Irresistible caramelised spiced biscuit crunch in every delicate bite.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 10,
    name: "Oreo Chocolate Cake",
    targetSlug: "oreo-chocolate-cake",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["oreo-chocolate-cake"],
    description: "Fluffy chocolate sponge layered with cookies and cream frosting and loaded with real Oreo biscuit pieces.",
    ingredients: "Oreo biscuit crumble, chocolate sponge, vanilla cookies cream",
    editorialQuote: "The irresistible classic pairing of dark chocolate and crunchy Oreo cookies.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 11,
    name: "Choco Chips Cake",
    targetSlug: "choco-chips-cake",
    targetCategorySlug: "chocolate-cakes",
    legacySlugs: ["choco-chips-cake"],
    description: "Moist chocolate sponge studded with dark chocolate chips and finished with smooth cocoa frosting.",
    ingredients: "Dark chocolate chips, cocoa sponge, dairy cream, chocolate ganache",
    editorialQuote: "Double chocolate delight with delightful chocolate crunch in every slice.",
    displayRating: 4.7,
    ratingLabel: "Popular Choice",
    bestseller: true,
    featured: false,
    isNew: true,
    isCustomQuote: false,
  },

  // --- FRUIT, JELLY & FRESH CREAM ---
  {
    num: 12,
    name: "Fresh Pineapple Cake",
    targetSlug: "fresh-pineapple-cake",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    legacySlugs: ["fresh-pineapple-cake"],
    description: "Light vanilla sponge layered with juicy pineapple compote and fresh dairy cream for a refreshing celebratory treat.",
    ingredients: "Fresh pineapple compote, vanilla sponge, fresh dairy cream, cherries",
    editorialQuote: "Bright, refreshing tropical pineapple folded into airy dairy cream.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 13,
    name: "Mango Delight Cake",
    targetSlug: "mango-delight",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    legacySlugs: ["mango-delight"],
    description: "Tropical Alphonso mango pulp folded into light vanilla sponge with whipped cream and mango glaze.",
    ingredients: "Alphonso mango pulp, vanilla sponge, fresh dairy cream, mango glaze",
    editorialQuote: "Sun-ripened royal mango sweetness captured in a cloud of fresh cream.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 14,
    name: "Mixed Berry Vanilla Cake",
    targetSlug: "mixed-berry-vanilla",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    legacySlugs: ["wild-berry-madagascar-vanilla"],
    description: "Fragrant vanilla sponge infused with a tangy compote of blueberries, raspberries and smooth berry glaze.",
    ingredients: "Wild berry compote, vanilla sponge, fresh cream, mixed berry coulis",
    editorialQuote: "A harmonious balance of sweet wild berries and smooth dairy cream.",
    displayRating: 4.7,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 15,
    name: "Rose Lychee Delight Cake",
    targetSlug: "rose-lychee-delight",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    legacySlugs: ["velvet-rose-raspberry-lychee"],
    description: "Delicate floral rose-infused sponge paired with sweet lychee pieces and light, silky rose cream frosting.",
    ingredients: "Rose extract, juicy lychee fruit, vanilla sponge, fresh dairy cream",
    editorialQuote: "An enchanting blend of fragrant rose petals and juicy sweet lychees.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },

  // --- RED VELVET & PREMIUM ---
  {
    num: 16,
    name: "Red Velvet Cake",
    targetSlug: "red-velvet",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["red-velvet-romance"],
    description: "Classic scarlet cocoa sponge layered with signature cream cheese frosting for an iconic, indulgent celebration.",
    ingredients: "Red velvet sponge, cocoa, cream cheese frosting, pure vanilla",
    editorialQuote: "Velvety scarlet sponge and silky cream cheese for memorable moments.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 17,
    name: "Pistachio Cardamom Cake",
    targetSlug: "pistachio-cardamom",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["sicilian-pistachio-mousse"],
    description: "Finely ground Iranian pistachios and aromatic green cardamom infused into a rich, nutty celebration sponge.",
    ingredients: "Ground pistachios, green cardamom, butter sponge, white chocolate glaze",
    editorialQuote: "Regal Iranian pistachios balanced with fragrant royal cardamom.",
    displayRating: 4.9,
    ratingLabel: "Premium Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 18,
    name: "Pistachio Rose Cake",
    targetSlug: "pistachio-rose",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["pistachio-rose"],
    description: "A royal pairing of nutty pistachio sponge layered with delicate damask rose cream and dried rose petals.",
    ingredients: "Pistachio sponge, rose water cream, edible rose petals, pistachios",
    editorialQuote: "A romantic fusion of earthy roasted nuts and gentle floral notes.",
    displayRating: 4.8,
    ratingLabel: "Premium Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 19,
    name: "Ferrero Hazelnut Praline Cake",
    targetSlug: "ferrero-hazelnut-praline",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["ferrero-rocher-praline"],
    description: "Multi-layered chocolate hazelnut cake with caramelized nut praline, wafer crumble and rich Nutella ganache.",
    ingredients: "Roasted hazelnuts, Nutella ganache, wafer crunch, dark chocolate sponge",
    editorialQuote: "Decadent caramelized hazelnut praline paired with velvety cocoa.",
    displayRating: 4.9,
    ratingLabel: "Premium Choice",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 20,
    name: "Basque Burnt Cheesecake",
    targetSlug: "basque-burnt-cheesecake",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["basque-burnt-cheesecake"],
    description: "Authentic San Sebastian-style cheesecake with a deeply caramelized crust and a rich, creamy custard center.",
    ingredients: "Cream cheese, fresh dairy cream, caramelized sugar, vanilla bean",
    editorialQuote: "Caramelized rustic crust giving way to an irresistibly molten center.",
    displayRating: 4.8,
    ratingLabel: "Signature Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 21,
    name: "Blueberry Cheesecake",
    targetSlug: "blueberry-cheesecake",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["blueberry-cheesecake"],
    description: "Rich baked Philadelphia cream cheese on a biscuit crumb base, topped with whole wild blueberry compote.",
    ingredients: "Philadelphia cream cheese, wild blueberries, buttery biscuit base, lemon zest",
    editorialQuote: "Smooth baked cream cheese crowned with vibrant whole wild blueberries.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 22,
    name: "Royal Gold Chocolate Truffle",
    targetSlug: "royal-gold-chocolate-truffle",
    targetCategorySlug: "red-velvet-premium",
    legacySlugs: ["24k-royal-gold-truffle"],
    description: "Grand celebration cake layered with intense 70% dark Belgian ganache, finished with edible 24K gold leaf accents.",
    ingredients: "Belgian 70% dark chocolate, edible 24K gold foil, cocoa sponge, dairy cream",
    editorialQuote: "Opulent dark chocolate craftsmanship adorned with genuine 24K gold leaf.",
    displayRating: 4.9,
    ratingLabel: "Signature Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },

  // --- HEART, DOLL & DESIGNER CAKES ---
  {
    num: 23,
    name: "Designer Heart Cake",
    targetSlug: "designer-heart-cake",
    targetCategorySlug: "heart-doll-designer",
    legacySlugs: ["designer-heart-cake"],
    description: "A beautifully decorated heart-shaped celebration cake with custom colours, piping and a personalised message.",
    ingredients: "Vanilla or chocolate sponge, fresh cream, custom chocolate plaque, piping cream",
    editorialQuote: "Handcrafted heart silhouette designed to celebrate your deepest affections.",
    displayRating: 4.8,
    ratingLabel: "Popular Choice",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
    customizationInfo: "Custom message, piped decoration, colour preference"
  },

  // --- PHOTO & THEME CAKES ---
  {
    num: 24,
    name: "Custom Edible Photo Cake",
    targetSlug: "custom-edible-photo-cake",
    targetCategorySlug: "photo-theme-cakes",
    legacySlugs: ["custom-bespoke-photo-cake"],
    description: "A personalised celebration cake featuring a customer-selected edible photo with a clean custom design.",
    ingredients: "Edible sugar sheet photo, vanilla sponge, dairy cream, decorative border",
    editorialQuote: "Turn cherished memories into stunning, delicious edible centerpieces.",
    displayRating: 4.9,
    ratingLabel: "Custom Favourite",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
    customizationInfo: "Photo upload, message, colour/theme"
  },

  // --- MINI & BENTO CAKES ---
  {
    num: 25,
    name: "Bento Celebration Cake",
    targetSlug: "bento-celebration-cake",
    targetCategorySlug: "mini-bento-cakes",
    legacySlugs: ["bento-celebration-cake"],
    description: "A compact celebration cake designed for small moments, short messages and intimate celebrations.",
    ingredients: "Vanilla sponge, pastel dairy cream, custom hand-piped message",
    editorialQuote: "Cute, intimate and delightfully styled for personal milestones.",
    displayRating: 4.9,
    ratingLabel: "Small Celebration",
    bestseller: false,
    featured: false,
    isNew: true,
    isCustomQuote: false,
    customizationInfo: "Short message up to 3 words"
  },

  // --- FUSION & INDIAN FLAVOURS ---
  {
    num: 26,
    name: "Royal Rasmalai Cake",
    targetSlug: "royal-rasmalai-cake",
    targetCategorySlug: "fusion-indian-flavours",
    legacySlugs: ["royal-rasmalai-cake"],
    description: "Soft cake layered with creamy rasmalai-inspired filling and delicate Indian dessert flavours.",
    ingredients: "Cardamom sponge, real rasmalai pieces, saffron infused cream, slivered pistachios",
    editorialQuote: "Traditional royal rasmalai elegance meets modern pâtisserie lightness.",
    displayRating: 4.8,
    ratingLabel: "Premium Choice",
    bestseller: false,
    featured: true,
    isNew: true,
    isCustomQuote: false,
    customizationInfo: "Custom message"
  },

  // --- LARGE & CELEBRATION CAKES ---
  {
    num: 27,
    name: "Royal Chocolate Celebration Cake",
    targetSlug: "royal-chocolate-celebration-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["royal-chocolate-celebration-cake"],
    description: "Grand multi-tier chocolate celebration cake crafted for lavish milestone parties and grand receptions.",
    ingredients: "Dark Belgian cocoa sponge, chocolate ganache, golden chocolate pearls",
    editorialQuote: "A grand statement chocolate centerpiece built to impress every guest.",
    displayRating: 4.9,
    ratingLabel: "Grand Celebration",
    bestseller: true,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 28,
    name: "Red Velvet Celebration Cake",
    targetSlug: "red-velvet-celebration-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["red-velvet-celebration-cake"],
    description: "Striking multi-tier red velvet cake layered with velvet cream cheese for elegant wedding anniversaries.",
    ingredients: "Scarlet cocoa sponge, velvet cream cheese frosting, red velvet crumbles",
    editorialQuote: "Dramatic scarlet tiers crafted for milestone wedding anniversaries.",
    displayRating: 4.8,
    ratingLabel: "Grand Celebration",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 29,
    name: "Black Forest Party Cake",
    targetSlug: "black-forest-party-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["black-forest-party-cake"],
    description: "Generously sized party cake featuring chocolate sponge, sour cherries and fresh whipped dairy cream.",
    ingredients: "Chocolate sponge, sour cherry compote, fresh dairy cream, chocolate curls",
    editorialQuote: "A crowd-pleasing celebration classic scaled up for joyous family gatherings.",
    displayRating: 4.8,
    ratingLabel: "Bakery Favourite",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 30,
    name: "Designer Celebration Cake",
    targetSlug: "designer-celebration-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["designer-celebration-cake"],
    description: "Artisan tiered centerpiece cake styled with custom piping, luxury accents and bespoke party themes.",
    ingredients: "Vanilla or chocolate sponge, structured buttercream, sugarcraft decor",
    editorialQuote: "Showstopping bespoke cake artistry tailored to your celebration theme.",
    displayRating: 4.9,
    ratingLabel: "Grand Celebration",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 31,
    name: "Grand Anniversary Cake",
    targetSlug: "grand-anniversary-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["grand-anniversary-cake"],
    description: "Refined multi-tier anniversary cake adorned with metallic accents, delicate piping and anniversary greetings.",
    ingredients: "Vanilla butter sponge, white chocolate mousse, edible gold dust",
    editorialQuote: "Honour timeless love and milestones with an elegant multi-tier masterpiece.",
    displayRating: 4.9,
    ratingLabel: "Grand Celebration",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 32,
    name: "Grand Birthday Celebration Cake",
    targetSlug: "grand-birthday-celebration-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["grand-birthday-celebration-cake"],
    description: "Vibrant large-scale birthday cake designed to feed celebratory crowds with rich layers and celebratory decor.",
    ingredients: "Multi-flavour sponge options, whipped dairy cream, celebration sprinkles",
    editorialQuote: "Festive, joyful and generously portioned for unforgettable birthday parties.",
    displayRating: 4.8,
    ratingLabel: "Grand Celebration",
    bestseller: true,
    featured: false,
    isNew: false,
    isCustomQuote: false,
  },
  {
    num: 33,
    name: "Tall & Tiered Celebration Cake",
    targetSlug: "tall-tiered-celebration-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["tall-tiered-celebration-cake"],
    description: "Architectural tall and tiered cake built for high-profile banquets, weddings and designer receptions.",
    ingredients: "Custom choice of artisan sponge, structured fillings, handcrafted decor",
    editorialQuote: "Dramatic towering proportions tailored to bespoke celebration visions.",
    displayRating: 4.9,
    ratingLabel: "Custom Quote",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: true,
  },
  {
    num: 34,
    name: "Custom Event Cake",
    targetSlug: "custom-event-cake",
    targetCategorySlug: "large-celebration-cakes",
    legacySlugs: ["custom-event-cake"],
    description: "Fully bespoke large-scale cake crafted for weddings, corporate galas and major milestone celebrations.",
    ingredients: "Bespoke recipe, custom tiers, tailored fillings, artisanal finish",
    editorialQuote: "Your custom dream cake brought to life with master confectionery technique.",
    displayRating: 4.9,
    ratingLabel: "Custom Quote",
    bestseller: false,
    featured: true,
    isNew: false,
    isCustomQuote: true,
  },
];

// ==========================================
// 3. 12 MOTIHARI LOCAL PRODUCTS (DRAFT ONLY)
// ==========================================
const LOCAL_12_DRAFTS = [
  {
    code: 'A',
    name: "Choco Vanilla Cake",
    targetSlug: "choco-vanilla-cake",
    targetCategorySlug: "classic-cakes",
    description: "Two classic favourites in one harmonious cake with layered chocolate sponge and fresh vanilla dairy cream.",
  },
  {
    code: 'B',
    name: "Strawberry Fresh Cream Cake",
    targetSlug: "strawberry-fresh-cream-cake",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    description: "Fluffy vanilla sponge layered with juicy strawberry compote, whipped cream and red berry accents.",
  },
  {
    code: 'C',
    name: "Chocolate Jelly Cake",
    targetSlug: "chocolate-jelly-cake",
    targetCategorySlug: "fruit-jelly-fresh-cream",
    description: "Silky chocolate sponge topped with a delicate fruity jelly layer for a playful textural celebration.",
  },
  {
    code: 'D',
    name: "Doll Cake",
    targetSlug: "doll-cake",
    targetCategorySlug: "heart-doll-designer",
    description: "Princess doll celebration cake featuring a stunning piped gown in pink vanilla fresh cream.",
  },
  {
    code: 'E',
    name: "Butterfly Cake",
    targetSlug: "butterfly-cake",
    targetCategorySlug: "heart-doll-designer",
    description: "Artisanal butterfly-shaped celebration cake piped with colourful pastel cream and sparkling sprinkles.",
  },
  {
    code: 'F',
    name: "Heart Black Forest Cake",
    targetSlug: "heart-black-forest-cake",
    targetCategorySlug: "heart-doll-designer",
    description: "Romantic heart silhouette filled with rich chocolate sponge, tart sour cherries and whipped dairy cream.",
  },
  {
    code: 'G',
    name: "Heart Strawberry Cake",
    targetSlug: "heart-strawberry-cake",
    targetCategorySlug: "heart-doll-designer",
    description: "Heart-shaped pink celebration cake infused with natural strawberry compote and sweet cream piping.",
  },
  {
    code: 'H',
    name: "KitKat Crunch Cake",
    targetSlug: "kitkat-crunch-cake",
    targetCategorySlug: "chocolate-cakes",
    description: "Chocolate sponge bordered with crispy KitKat bars and crowned with colorful chocolate buttons.",
  },
  {
    code: 'I',
    name: "Chocolate Bento Cake",
    targetSlug: "chocolate-bento-cake",
    targetCategorySlug: "mini-bento-cakes",
    description: "Mini chocolate lunchbox cake layered with rich cocoa ganache, perfect for personal celebrations.",
  },
  {
    code: 'J',
    name: "Red Velvet Bento Cake",
    targetSlug: "red-velvet-bento-cake",
    targetCategorySlug: "mini-bento-cakes",
    description: "Petite scarlet bento cake with silky cream cheese frosting and customizable short greeting message.",
  },
  {
    code: 'K',
    name: "Gulab Jamun Cake",
    targetSlug: "gulab-jamun-cake",
    targetCategorySlug: "fusion-indian-flavours",
    description: "Indian fusion masterpiece combining cardamom-scented sponge with real gulab jamun pieces and pistachios.",
  },
  {
    code: 'L',
    name: "Kesar Pista Rabri Cake",
    targetSlug: "kesar-pista-rabri-cake",
    targetCategorySlug: "fusion-indian-flavours",
    description: "Royal saffron sponge soaked with rich rabri-inspired cream, garnished with roasted pistachio slivers.",
  },
];

async function runSync() {
  console.log(`\n==================================================`);
  console.log(`RAMAN SWEET BAKERY — PRODUCTION-SAFE MASTER CATALOG SYNC`);
  console.log(`MODE: ${isDryRun ? "DRY RUN ONLY (NO MUTATIONS)" : "LIVE PRODUCTION EXECUTION"}`);
  console.log(`==================================================\n`);

  // 1. Fetch current DB state
  const [existingCategories, existingCakes, existingOccasions, existingCakeOccasions] = await Promise.all([
    prisma.category.findMany({ orderBy: { displayOrder: 'asc' } }),
    prisma.cake.findMany({
      include: {
        category: true,
        prices: { orderBy: { price: 'asc' } },
        occasions: { include: { occasion: true } }
      }
    }),
    prisma.occasion.findMany({ orderBy: { name: 'asc' } }),
    prisma.cakeOccasion.findMany({
      include: {
        cake: { select: { id: true, name: true, slug: true } },
        occasion: { select: { id: true, name: true, slug: true } }
      }
    })
  ]);

  console.log(`Loaded ${existingCategories.length} categories, ${existingCakes.length} cakes, ${existingOccasions.length} occasions.`);

  // -------------------------------------------------------------
  // CATEGORY PLAN & MATCHING
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`1. CATEGORY PLAN`);
  console.log(`==================================================`);
  const categoryPlan = [];
  const categoryByTargetSlug = {};

  for (const targetCat of TARGET_CATEGORIES) {
    let matched = existingCategories.find(c => c.slug === targetCat.slug);
    let matchReason = "exact slug";
    if (!matched) {
      matched = existingCategories.find(c => targetCat.legacySlugs.includes(c.slug));
      if (matched) matchReason = `legacy slug (${matched.slug})`;
    }
    if (!matched) {
      matched = existingCategories.find(c => c.name.toLowerCase() === targetCat.name.toLowerCase());
      if (matched) matchReason = `normalized name (${matched.name})`;
    }

    if (matched) {
      categoryPlan.push({
        action: "UPDATE",
        targetSlug: targetCat.slug,
        targetName: targetCat.name,
        targetOrder: targetCat.order,
        existingId: matched.id,
        existingSlug: matched.slug,
        existingName: matched.name,
        existingOrder: matched.displayOrder,
        matchReason
      });
      categoryByTargetSlug[targetCat.slug] = { id: matched.id, targetCat };
    } else {
      categoryPlan.push({
        action: "CREATE",
        targetSlug: targetCat.slug,
        targetName: targetCat.name,
        targetOrder: targetCat.order,
        matchReason: "none (new category required)"
      });
    }
  }

  // Categories to deactivate (e.g. vanilla-cakest)
  const categoriesToDeactivate = existingCategories.filter(ec => {
    return !categoryPlan.some(p => p.existingId === ec.id);
  });

  categoryPlan.forEach(p => {
    if (p.action === "UPDATE") {
      console.log(`[UPDATE CATEGORY] "${p.existingName}" (${p.existingSlug}) -> "${p.targetName}" (${p.targetSlug}) | Order: ${p.existingOrder} -> ${p.targetOrder} | Match: ${p.matchReason}`);
    } else {
      console.log(`[CREATE CATEGORY] "${p.targetName}" (${p.targetSlug}) | Order: ${p.targetOrder} | Required`);
    }
  });
  categoriesToDeactivate.forEach(c => {
    console.log(`[DEACTIVATE CATEGORY] "${c.name}" (${c.slug}) -> set active=false, order=99 (NOT DELETED)`);
  });

  // -------------------------------------------------------------
  // CAKE PLAN & MATCHING
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`2. CAKE MATCHING & PLAN (TARGET 34 PUBLIC CAKES)`);
  console.log(`==================================================`);
  const cakePlan = [];
  const assignedCakeIds = new Set();

  for (const tc of TARGET_34_CAKES) {
    let matched = null;
    let matchType = "";

    // 1. Prioritize matching against PUBLISHED CAKE records
    // Match by explicit legacy slugs on published cakes
    if (tc.legacySlugs && tc.legacySlugs.length > 0) {
      matched = existingCakes.find(c => c.available && c.productType === "CAKE" && tc.legacySlugs.includes(c.slug) && !assignedCakeIds.has(c.id));
      if (matched) matchType = `published cake legacy slug (${matched.slug})`;
    }

    // Match by exact slug on published cakes
    if (!matched) {
      matched = existingCakes.find(c => c.available && c.productType === "CAKE" && c.slug === tc.targetSlug && !assignedCakeIds.has(c.id));
      if (matched) matchType = `published cake exact slug (${matched.slug})`;
    }

    // Match by exact name on published cakes
    if (!matched) {
      matched = existingCakes.find(c => c.available && c.productType === "CAKE" && c.name.toLowerCase() === tc.name.toLowerCase() && !assignedCakeIds.has(c.id));
      if (matched) matchType = `published cake exact name ("${matched.name}", slug: "${matched.slug}")`;
    }

    // Fallback: match any cake if not matched among published
    if (!matched) {
      matched = existingCakes.find(c => c.slug === tc.targetSlug && !assignedCakeIds.has(c.id));
      if (matched) matchType = `fallback exact slug (${matched.slug})`;
    }
    if (!matched && tc.legacySlugs) {
      matched = existingCakes.find(c => tc.legacySlugs.includes(c.slug) && !assignedCakeIds.has(c.id));
      if (matched) matchType = `fallback legacy slug (${matched.slug})`;
    }
    if (!matched) {
      matched = existingCakes.find(c => c.name.toLowerCase() === tc.name.toLowerCase() && !assignedCakeIds.has(c.id));
      if (matched) matchType = `fallback exact name ("${matched.name}", slug: "${matched.slug}")`;
    }

    if (!matched) {
      console.error(`FATAL: Could not match target cake #${tc.num}: "${tc.name}"`);
      process.exit(1);
    }

    assignedCakeIds.add(matched.id);

    cakePlan.push({
      target: tc,
      matchedCake: matched,
      matchType
    });

    console.log(`[MATCH #${tc.num}] "${tc.name}" -> DB: "${matched.name}" (ID: ${matched.id}, current slug: "${matched.slug}") via ${matchType}`);
  }

  // Check Butterscotch duplicate
  const bCake1 = existingCakes.find(c => c.slug === "butterscotch-cake");
  const bCake2 = existingCakes.find(c => c.slug === "butterscotch");
  console.log(`\n[BUTTERSCOTCH DUPLICATE RESOLUTION]`);
  console.log(`- Primary Target Cake: ID=${bCake1?.id}, slug="${bCake1?.slug}", name="${bCake1?.name}"`);
  console.log(`- Original Data Source Cake: ID=${bCake2?.id}, slug="${bCake2?.slug}", verified prices=[${bCake2?.prices?.map(p => `${p.weight}: ₹${p.price}`).join(', ')}]`);
  console.log(`- Action: Transfer verified prices & ImageKit cover to butterscotch-cake, deactivate butterscotch (available=false), 308 redirect`);

  // -------------------------------------------------------------
  // PRICE PLAN
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`3. PRICE PLAN`);
  console.log(`==================================================`);
  cakePlan.forEach(({ target, matchedCake }) => {
    if (target.isCustomQuote) {
      console.log(`[CUSTOM QUOTE CAKE] "${target.name}": isCustomQuote=true, all prices set to null`);
    } else if (target.verifiedPrices) {
      console.log(`[EXPLICIT VERIFIED PRICING] "${target.name}": ${target.verifiedPrices.map(p => `${p.weight}: ₹${p.price}`).join(', ')}`);
    } else {
      const priceSummary = matchedCake.prices.map(p => `${p.weight}: ₹${p.price}`).join(', ');
      console.log(`[PRESERVED PRICING] "${target.name}": [${priceSummary}]`);
    }
  });

  // -------------------------------------------------------------
  // IMAGE PLAN
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`4. IMAGE PLAN`);
  console.log(`==================================================`);
  cakePlan.forEach(({ target, matchedCake }) => {
    const isImageKit = matchedCake.coverImage?.includes("ik.imagekit.io");
    console.log(`[PRESERVED IMAGE] "${target.name}" -> ${isImageKit ? "Verified ImageKit" : "Existing Asset"}: ${matchedCake.coverImage}`);
  });

  // -------------------------------------------------------------
  // 12 LOCAL DRAFT PRODUCTS PLAN
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`5. 12 MOTIHARI LOCAL PRODUCTS PLAN (DRAFT / INCOMPLETE)`);
  console.log(`==================================================`);
  LOCAL_12_DRAFTS.forEach(loc => {
    const exists = existingCakes.find(c => c.slug === loc.targetSlug || c.name.toLowerCase() === loc.name.toLowerCase());
    if (exists) {
      console.log(`[REUSE EXISTING] ${loc.code}. "${loc.name}" already in DB (slug: "${exists.slug}")`);
    } else {
      console.log(`[CREATE DRAFT] ${loc.code}. "${loc.name}" -> slug: "${loc.targetSlug}", category: "${loc.targetCategorySlug}", available: false, prices: [] (0 rows, NO ₹0)`);
    }
  });

  // -------------------------------------------------------------
  // OCCASION PLAN
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`6. OCCASION PLAN`);
  console.log(`==================================================`);
  console.log(`Inspected current Occasion model: Represents calendar-window festival engine (calendarKey, daysBefore, daysAfter, FestivalOccurrence).`);
  console.log(`Rule 17 Compliance: DO NOT insert Birthday, Anniversary, Wedding into calendar festival engine.`);
  console.log(`Festival calendar engine remains 100% intact.`);
  console.log(`Occasion relationships: Preserving verified festival assignments, clearing indiscriminate duplicate links (e.g. Belgian Chocolate Truffle assigned to 7 festivals).`);

  // -------------------------------------------------------------
  // REDIRECT PLAN
  // -------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`7. REDIRECT PLAN (308 PERMANENT)`);
  console.log(`==================================================`);
  const categoryRedirects = [
    { from: "/menu/category/fruit-fresh-cream", to: "/menu/category/fruit-jelly-fresh-cream" },
    { from: "/menu/category/designer-photo-cakes", to: "/menu/category/heart-doll-designer" },
    { from: "/menu/category/fusion-cakes", to: "/menu/category/fusion-indian-flavours" },
    { from: "/menu/category/vanilla-cakest", to: "/menu/category/classic-cakes" },
  ];
  categoryRedirects.forEach(r => {
    console.log(`[CATEGORY 308] ${r.from} -> ${r.to}`);
  });

  const cakeRedirects = [
    { from: "/menu/cake/belgian-dark-chocolate-ganache", to: "/menu/cake/belgian-chocolate-truffle" },
    { from: "/menu/cake/ferrero-rocher", to: "/menu/cake/ferrero-rocher-chocolate-cake" },
    { from: "/menu/cake/lotus-biscoff-salted-caramel", to: "/menu/cake/lotus-biscoff-caramel" },
    { from: "/menu/cake/wild-berry-madagascar-vanilla", to: "/menu/cake/mixed-berry-vanilla" },
    { from: "/menu/cake/velvet-rose-raspberry-lychee", to: "/menu/cake/rose-lychee-delight" },
    { from: "/menu/cake/red-velvet-romance", to: "/menu/cake/red-velvet" },
    { from: "/menu/cake/sicilian-pistachio-mousse", to: "/menu/cake/pistachio-cardamom" },
    { from: "/menu/cake/ferrero-rocher-praline", to: "/menu/cake/ferrero-hazelnut-praline" },
    { from: "/menu/cake/24k-royal-gold-truffle", to: "/menu/cake/royal-gold-chocolate-truffle" },
    { from: "/menu/cake/custom-bespoke-photo-cake", to: "/menu/cake/custom-edible-photo-cake" },
    { from: "/menu/cake/butterscotch", to: "/menu/cake/butterscotch-cake" },
  ];
  cakeRedirects.forEach(r => {
    console.log(`[CAKE 308] ${r.from} -> ${r.to}`);
  });

  // -------------------------------------------------------------
  // DRY RUN CONCLUSION
  // -------------------------------------------------------------
  if (isDryRun) {
    console.log(`\n==================================================`);
    console.log(`DRY RUN ONLY — NO MUTATIONS EXECUTED`);
    console.log(`==================================================\n`);
    return;
  }

  // =============================================================
  // LIVE DATABASE EXECUTION (INSIDE PRISMA TRANSACTION)
  // =============================================================
  console.log(`\n==================================================`);
  console.log(`EXECUTING LIVE PRODUCTION DATABASE TRANSACTION...`);
  console.log(`==================================================\n`);

  await prisma.$transaction(async (tx) => {
    // A. Resolve Slug Collisions first for inactive cakes
    console.log(`Phase 0: Resolving draft slug collisions...`);
    await tx.cake.updateMany({
      where: { slug: "red-velvet", available: false },
      data: { slug: "red-velvet-legacy-draft" }
    });
    await tx.cake.updateMany({
      where: { slug: "lotus-biscoff-caramel", available: false },
      data: { slug: "lotus-biscoff-legacy-draft" }
    });
    console.log(`Draft slug collisions resolved.`);

    // B. Sync Categories
    console.log(`Phase 1: Syncing Categories...`);
    const categoryMap = {}; // targetSlug -> categoryId

    for (const p of categoryPlan) {
      if (p.action === "UPDATE") {
        const updated = await tx.category.update({
          where: { id: p.existingId },
          data: {
            name: p.targetName,
            slug: p.targetSlug,
            displayOrder: p.targetOrder,
            active: true
          }
        });
        categoryMap[p.targetSlug] = updated.id;
        console.log(`  Updated category: "${updated.name}" (${updated.slug}) -> order ${updated.displayOrder}`);
      } else if (p.action === "CREATE") {
        const created = await tx.category.create({
          data: {
            name: p.targetName,
            slug: p.targetSlug,
            displayOrder: p.targetOrder,
            active: true
          }
        });
        categoryMap[p.targetSlug] = created.id;
        console.log(`  Created category: "${created.name}" (${created.slug}) -> order ${created.displayOrder}`);
      }
    }

    // Deactivate unneeded categories
    for (const c of categoriesToDeactivate) {
      await tx.category.update({
        where: { id: c.id },
        data: { active: false, displayOrder: 99 }
      });
      console.log(`  Deactivated category: "${c.name}" (${c.slug})`);
    }

    // C. Butterscotch Duplicate Resolution
    console.log(`Phase 2: Butterscotch duplicate resolution...`);
    const bCake1 = await tx.cake.findUnique({ where: { slug: "butterscotch-cake" } });
    const bCake2 = await tx.cake.findUnique({
      where: { slug: "butterscotch" },
      include: { prices: true, occasions: true }
    });

    if (bCake1 && bCake2) {
      // 1. Delete existing placeholder price rows on butterscotch-cake
      await tx.cakePrice.deleteMany({ where: { cakeId: bCake1.id } });

      // 2. Insert verified price rows
      for (const vp of TARGET_34_CAKES.find(c => c.targetSlug === "butterscotch-cake").verifiedPrices) {
        await tx.cakePrice.create({
          data: {
            cakeId: bCake1.id,
            weight: vp.weight,
            price: vp.price,
            originalPrice: vp.originalPrice,
            isDefault: vp.isDefault,
            isCustomQuote: false
          }
        });
      }

      // 3. Update coverImage & images from original
      await tx.cake.update({
        where: { id: bCake1.id },
        data: {
          coverImage: bCake2.coverImage,
          images: bCake2.images,
          categoryId: categoryMap["classic-cakes"],
          available: true
        }
      });

      // 4. Set old record to available=false
      await tx.cake.update({
        where: { id: bCake2.id },
        data: { available: false }
      });

      console.log(`  Butterscotch duplicate resolved cleanly.`);
    }

    // D. Update existing 34 public cakes
    console.log(`Phase 3: Updating existing 34 public cakes...`);
    for (const { target, matchedCake } of cakePlan) {
      const targetCatId = categoryMap[target.targetCategorySlug];
      if (!targetCatId) {
        throw new Error(`Category ID not found for target slug: ${target.targetCategorySlug}`);
      }

      // Prepare update payload
      const updateData = {
        name: target.name,
        slug: target.targetSlug,
        categoryId: targetCatId,
        description: target.description,
        ingredients: target.ingredients,
        editorialQuote: target.editorialQuote || null,
        displayRating: target.displayRating,
        ratingLabel: target.ratingLabel,
        bestseller: target.bestseller,
        featured: target.featured,
        isNew: target.isNew,
        available: true,
        productType: "CAKE",
        isCustomQuote: target.isCustomQuote
      };

      if (target.customizationInfo) {
        updateData.customizationInfo = target.customizationInfo;
      }

      await tx.cake.update({
        where: { id: matchedCake.id },
        data: updateData
      });

      // Custom quote pricing normalization
      if (target.isCustomQuote) {
        await tx.cakePrice.updateMany({
          where: { cakeId: matchedCake.id },
          data: {
            price: null,
            isCustomQuote: true
          }
        });
      }

      console.log(`  Updated cake #${target.num}: "${target.name}" (${target.targetSlug}) -> category: ${target.targetCategorySlug}`);
    }

    // E. Create 12 Motihari Local Products (Draft / Inactive)
    console.log(`Phase 4: Initializing 12 Motihari Local Products (Draft)...`);
    for (const loc of LOCAL_12_DRAFTS) {
      const existing = await tx.cake.findFirst({
        where: {
          OR: [{ slug: loc.targetSlug }, { name: loc.name }]
        }
      });

      if (!existing) {
        const catId = categoryMap[loc.targetCategorySlug];
        await tx.cake.create({
          data: {
            name: loc.name,
            slug: loc.targetSlug,
            categoryId: catId,
            description: loc.description,
            coverImage: "", // Draft - no fake image URL
            images: "[]",
            available: false, // Inactive pending live photo and pricing
            productType: "CAKE",
            isNew: true
          }
        });
        console.log(`  Created draft local product: "${loc.name}" (${loc.targetSlug}) [available=false, 0 prices]`);
      } else {
        console.log(`  Existing product reused for "${loc.name}"`);
      }
    }

    // F. Occasion Relationship Normalization
    console.log(`Phase 5: Normalizing Occasion relationships...`);
    // Remove indiscriminate multi-festival assignments on Belgian Chocolate Truffle
    const belgianCake = await tx.cake.findUnique({ where: { slug: "belgian-chocolate-truffle" } });
    if (belgianCake) {
      // Remove assignments to Halloween, Eid, Teachers Day, keeping Christmas/New Year/Winter
      await tx.cakeOccasion.deleteMany({
        where: {
          cakeId: belgianCake.id,
          occasion: {
            slug: { in: ["halloween", "eid-al-adha", "teachers-day"] }
          }
        }
      });
      console.log(`  Cleaned indiscriminate occasion links for Belgian Chocolate Truffle.`);
    }

    // G. Final In-Transaction Integrity Verification
    console.log(`Phase 6: Verifying transaction integrity...`);
    const finalActiveCategories = await tx.category.findMany({
      where: { active: true },
      orderBy: { displayOrder: "asc" }
    });
    if (finalActiveCategories.length !== 9) {
      throw new Error(`Expected exactly 9 active categories, found ${finalActiveCategories.length}`);
    }
    for (let i = 0; i < 9; i++) {
      if (finalActiveCategories[i].displayOrder !== i + 1) {
        throw new Error(`Active category "${finalActiveCategories[i].name}" has order ${finalActiveCategories[i].displayOrder}, expected ${i + 1}`);
      }
    }

    const finalPublicCakes = await tx.cake.findMany({
      where: { available: true, productType: "CAKE" },
      include: { prices: true }
    });
    if (finalPublicCakes.length !== 34) {
      throw new Error(`Expected exactly 34 public cakes, found ${finalPublicCakes.length}`);
    }

    // Check custom quote prices
    for (const cake of finalPublicCakes) {
      if (cake.isCustomQuote) {
        for (const p of cake.prices) {
          if (p.price !== null || !p.isCustomQuote) {
            throw new Error(`Custom quote cake "${cake.name}" has invalid price tier: price=${p.price}, isCustomQuote=${p.isCustomQuote}`);
          }
        }
      } else {
        for (const p of cake.prices) {
          if (p.price === null || p.price <= 0) {
            throw new Error(`Standard cake "${cake.name}" has invalid price: ${p.price}`);
          }
        }
      }
    }

    console.log(`Transaction integrity checks passed successfully!`);
  }, {
    maxWait: 30000,
    timeout: 120000
  });

  console.log(`\n==================================================`);
  console.log(`MASTER CATALOG SYNC COMPLETED SUCCESSFULLY!`);
  console.log(`==================================================\n`);
}

runSync()
  .catch((err) => {
    console.error("FATAL ERROR IN SYNC:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
