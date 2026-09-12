import React from "react";

interface CategoryIconProps {
  slug?: string;
  name?: string;
  className?: string;
}

export default function CategoryIcon({ slug = "", name = "", className = "w-6 h-6 sm:w-7 sm:h-7 text-[#E7C96B]" }: CategoryIconProps) {
  const s = slug.toLowerCase().trim();
  const n = name.toLowerCase().trim();

  // 1. ALL / SIGNATURE COLLECTION (Round Cake with 3 Candles)
  if (s === "all" || s === "") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Base plate / tier */}
        <ellipse cx="12" cy="18" rx="7.5" ry="2.8" />
        <path d="M4.5 14v4c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-4" />
        <path d="M4.5 14c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
        {/* Frosting wave */}
        <path d="M4.8 15.5c1.4.8 2.8-.8 4.2 0s2.8-.8 4.2 0 2.8-.8 4.2 0 2.8-.8 4.2 0" strokeWidth="1.2" />
        {/* 3 Candles */}
        <line x1="8" y1="14" x2="8" y2="10.5" />
        <line x1="12" y1="14" x2="12" y2="9.5" />
        <line x1="16" y1="14" x2="16" y2="10.5" />
        {/* Candle flames */}
        <path d="M8 8.8c-.4.4-.4.8 0 1.2s.4-.8 0-1.2z" fill="currentColor" strokeWidth="0.8" />
        <path d="M12 7.8c-.5.5-.5 1 0 1.5s.5-1 0-1.5z" fill="currentColor" strokeWidth="0.8" />
        <path d="M16 8.8c-.4.4-.4.8 0 1.2s.4-.8 0-1.2z" fill="currentColor" strokeWidth="0.8" />
      </svg>
    );
  }

  // 2. CHOCOLATE / TRUFFLE (Dripping Ganache Cake)
  if (s.includes("chocolate") || s.includes("truffle") || n.includes("chocolate") || n.includes("truffle")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Strawberry on top */}
        <circle cx="12" cy="7.5" r="1.8" fill="currentColor" fillOpacity="0.25" />
        <path d="M12 5.7c.4-.7 1.2-.7 1.5-1.2" strokeWidth="1.2" />
        {/* Cake body */}
        <ellipse cx="12" cy="11.5" rx="7" ry="2.5" />
        <path d="M5 11.5v7.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-7.5" />
        {/* Dripping chocolate ganache */}
        <path d="M5 13c1.5.8 2.2 0 3.2 1s1.5-1 2.8.3 1.8-1.2 3.2.8 2.3-1 3.8.2" strokeWidth="1.3" />
      </svg>
    );
  }

  // 3. FRUIT / FRUIT & BERRY (Berry Layered Sponge Cake)
  if (s.includes("fruit") || s.includes("berry") || n.includes("fruit") || n.includes("berry") || n.includes("mango")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Fresh Berries on top */}
        <circle cx="9" cy="7.5" r="1.5" fill="currentColor" fillOpacity="0.25" />
        <circle cx="12" cy="6.2" r="1.8" fill="currentColor" fillOpacity="0.25" />
        <circle cx="15" cy="7.5" r="1.5" fill="currentColor" fillOpacity="0.25" />
        {/* Layered cake body */}
        <ellipse cx="12" cy="11.5" rx="7" ry="2.5" />
        <path d="M5 11.5v7.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-7.5" />
        {/* Cream / Fruit filling middle line */}
        <path d="M5 15.5c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" strokeDasharray="2 1.5" strokeWidth="1.2" />
      </svg>
    );
  }

  // 4. CHEESECAKES (Cheesecake Wedge / Sliced Piece)
  if (s.includes("cheese") || n.includes("cheese")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Blueberry / Cherry compote top */}
        <circle cx="9.5" cy="8" r="1.4" fill="currentColor" fillOpacity="0.3" />
        <path d="M9.5 6.6c.3-.5.9-.6 1.1-1" strokeWidth="1.2" />
        {/* Triangular cheesecake wedge */}
        <path d="M4 14l10-5 6 3-10 5L4 14z" />
        <path d="M4 14v4l10 5v-4L4 14z" />
        <path d="M14 19l6-3v-4l-6 3v4z" />
        {/* Biscuit crust base */}
        <path d="M4 17l10 5 6-3" strokeWidth="1.2" strokeDasharray="2 1" />
      </svg>
    );
  }

  // 5. SIGNATURE LUXURY / PREMIUM (Royal Crown Tiered Cake)
  if (s.includes("signature") || s.includes("luxury") || s.includes("premium") || n.includes("signature") || n.includes("luxury") || n.includes("premium")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Crown on top */}
        <path d="M9 8l1.5-2.2L12 8l1.5-2.2L15 8H9z" fill="currentColor" fillOpacity="0.25" />
        {/* Tiered cake */}
        <ellipse cx="12" cy="12" rx="5.5" ry="2" />
        <path d="M6.5 12v3c0 1 2.5 2 5.5 2s5.5-1 5.5-2v-3" />
        <ellipse cx="12" cy="16" rx="8" ry="2.5" />
        <path d="M4 16v4c0 1.5 3.6 2.5 8 2.5s8-1 8-2.5v-4" />
      </svg>
    );
  }

  // 6. PHOTO CAKES / DESIGNER (Edible Sheet & Camera Theme)
  if (s.includes("photo") || s.includes("designer") || n.includes("photo") || n.includes("designer")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Edible photo sugar print frame */}
        <rect x="7" y="5.5" width="10" height="6.5" rx="1.2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="10" cy="7.8" r="1" fill="currentColor" />
        <path d="M7 11l2.5-2 2 1.5 2.5-2.5 3 3" strokeWidth="1.2" />
        {/* Cake base */}
        <path d="M5 14h14v5c0 1.5-3.1 2.5-7 2.5S5 20.5 5 19v-5z" />
        <ellipse cx="12" cy="14" rx="7" ry="2" />
      </svg>
    );
  }

  // 7. BIRTHDAY / CELEBRATION (Festive Celebration Starburst Cake)
  if (s.includes("birthday") || s.includes("celebration") || n.includes("birthday") || n.includes("celebration")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Celebration Starburst */}
        <path d="M12 3.8l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2z" fill="currentColor" />
        {/* Tier 1 */}
        <ellipse cx="12" cy="11" rx="4.5" ry="1.8" />
        <path d="M7.5 11v3c0 .9 2 1.8 4.5 1.8s4.5-.9 4.5-1.8v-3" />
        {/* Tier 2 */}
        <ellipse cx="12" cy="16" rx="7.5" ry="2.2" />
        <path d="M4.5 16v3.5c0 1.3 3.4 2.2 7.5 2.2s7.5-.9 7.5-2.2V16" />
      </svg>
    );
  }

  // 8. ANNIVERSARY / ROMANCE (Heart Confection)
  if (s.includes("anniversary") || n.includes("anniversary") || s.includes("love")) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
      >
        {/* Heart Topper */}
        <path d="M12 8c-.8-1.5-2.5-1.5-3.2 0-.8 1.5 1 3 3.2 4.5 2.2-1.5 4-3 3.2-4.5-.7-1.5-2.4-1.5-3.2 0z" fill="currentColor" fillOpacity="0.25" />
        {/* Cake base */}
        <ellipse cx="12" cy="14" rx="7" ry="2.5" />
        <path d="M5 14v5c0 1.5 3.1 2.5 7 2.5s7-1 7-2.5v-5" />
        <path d="M5 16.5c1.5.8 3.5 1.2 7 1.2s5.5-.4 7-1.2" strokeWidth="1.2" />
      </svg>
    );
  }

  // 9. DEFAULT LUXURY ARTISANAL BAKE
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.2" fill="currentColor" />
      <path d="M6 10c0-1.5 2.7-3 6-3s6 1.5 6 3-2.7 3-6 3-6-1.5-6-3z" />
      <path d="M7 11.5v6c0 1.5 2.2 2.5 5 2.5s5-1 5-2.5v-6" />
      <path d="M7 13.5c1 1 2 0 3 1s2-1 3 0 2-1 3 1" strokeWidth="1.2" />
    </svg>
  );
}
