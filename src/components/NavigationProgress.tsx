"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);

  // When pathname or searchParams change, the new page has rendered -> complete progress
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Intercept clicks on links to show instant visual progress feedback
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const url = new URL(target.href, window.location.href);
      const isInternal = url.origin === window.location.origin;
      const isAnchor = url.pathname === window.location.pathname && url.hash !== "";
      const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
      const isExternalTarget = target.target && target.target !== "_self";

      if (isInternal && !isAnchor && !isModified && !isExternalTarget) {
        if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
          setIsNavigating(true);
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] h-[3px] bg-transparent pointer-events-none">
      <div className="h-full bg-gradient-to-r from-[#C59B27] via-[#F3E5AB] to-[#D4AF37] animate-progressBar shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
    </div>
  );
}
