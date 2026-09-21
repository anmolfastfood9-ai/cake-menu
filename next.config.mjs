const isDev = process.env.NODE_ENV === "development";

// Restrictive, production-grade Content Security Policy
const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://ik.imagekit.io https://images.unsplash.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
  "media-src 'self' https://ik.imagekit.io",
  "worker-src 'self' blob:",
];

const contentSecurityPolicy = cspDirectives.join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Legacy Categories
      { source: "/menu/category/fruit-fresh-cream", destination: "/menu/category/fruit-jelly-fresh-cream", permanent: true },
      { source: "/menu/category/designer-photo-cakes", destination: "/menu/category/heart-doll-designer", permanent: true },
      { source: "/menu/category/fusion-cakes", destination: "/menu/category/fusion-indian-flavours", permanent: true },
      { source: "/menu/category/vanilla-cakest", destination: "/menu/category/classic-cakes", permanent: true },
      // Legacy Cake Slugs
      { source: "/menu/cake/belgian-dark-chocolate-ganache", destination: "/menu/cake/belgian-chocolate-truffle", permanent: true },
      { source: "/menu/cake/ferrero-rocher", destination: "/menu/cake/ferrero-rocher-chocolate-cake", permanent: true },
      { source: "/menu/cake/lotus-biscoff-salted-caramel", destination: "/menu/cake/lotus-biscoff-caramel", permanent: true },
      { source: "/menu/cake/wild-berry-madagascar-vanilla", destination: "/menu/cake/mixed-berry-vanilla", permanent: true },
      { source: "/menu/cake/velvet-rose-raspberry-lychee", destination: "/menu/cake/rose-lychee-delight", permanent: true },
      { source: "/menu/cake/red-velvet-romance", destination: "/menu/cake/red-velvet", permanent: true },
      { source: "/menu/cake/sicilian-pistachio-mousse", destination: "/menu/cake/pistachio-cardamom", permanent: true },
      { source: "/menu/cake/ferrero-rocher-praline", destination: "/menu/cake/ferrero-hazelnut-praline", permanent: true },
      { source: "/menu/cake/24k-royal-gold-truffle", destination: "/menu/cake/royal-gold-chocolate-truffle", permanent: true },
      { source: "/menu/cake/custom-bespoke-photo-cake", destination: "/menu/cake/custom-edible-photo-cake", permanent: true },
      { source: "/menu/cake/butterscotch", destination: "/menu/cake/butterscotch-cake", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
