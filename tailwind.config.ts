import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        luxury: {
          950: "#070605",
          900: "#0D0C0B",
          850: "#141210",
          800: "#1C1916",
          700: "#2B2621",
          600: "#443D36",
          500: "#695E54",
          400: "#A89B8C",
          300: "#D1C7BA",
          200: "#EAE3D9",
          100: "#F5F0E8",
          50: "#FAF7F2",
        },
        gold: {
          50: "#FDFBF2",
          100: "#FAF4DC",
          200: "#F4E5B0",
          300: "#ECD17E",
          400: "#E2BA4E",
          500: "#D4AF37", // Primary champagne gold
          600: "#B89225",
          700: "#92711B",
          800: "#73571A",
          900: "#5D4518",
          950: "#372709",
        },
        cream: {
          50: "#FFFFFF",
          100: "#FCFAF6",
          200: "#F7F2E9",
          300: "#EFE6D6",
          400: "#DECDB4",
          500: "#C9B291",
        }
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #ECC86B 0%, #D4AF37 50%, #A37F1D 100%)",
        "gold-glow": "radial-gradient(circle, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0) 70%)",
        "dark-card": "linear-gradient(180deg, rgba(28, 25, 22, 0.85) 0%, rgba(18, 16, 14, 0.95) 100%)",
      },
      boxShadow: {
        "gold-sm": "0 2px 10px rgba(212, 175, 55, 0.12)",
        "gold-md": "0 4px 20px rgba(212, 175, 55, 0.2)",
        "gold-lg": "0 8px 30px rgba(212, 175, 55, 0.25)",
        "gold-inner": "inset 0 1px 2px rgba(212, 175, 55, 0.3)",
      }
    },
  },
  plugins: [],
};
export default config;
