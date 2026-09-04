"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ActiveOccasionResult } from "@/lib/festivals/occasionEngine";

interface OccasionShowcaseProps {
  occasionData: ActiveOccasionResult | null;
}

export default function OccasionShowcase({
  occasionData,
}: OccasionShowcaseProps) {
  /*
   * No active occasion = no banner.
   * This keeps the /menu layout clean when there is nothing to show.
   */
  if (!occasionData?.occasion) {
    return null;
  }

  const text = occasionData.occasion.name.trim();

  /*
   * ------------------------------------------------------------
   * Build a compact two-line title only when useful.
   *
   * Examples:
   * "Krishna Janmashtami & Teachers' Day Special"
   * →
   * "Krishna Janmashtami &"
   * "Teachers' Day Special"
   *
   * "Christmas Special"
   * →
   * "Christmas"
   * "Special"
   *
   * Otherwise keep the original title.
   * ------------------------------------------------------------
   */
  let line1 = text;
  let line2 = "";

  if (text.includes(" & ")) {
    const parts = text.split(" & ");

    line1 = `${parts[0].trim()} &`;
    line2 = parts.slice(1).join(" & ").trim();
  } else if (/\s+Special$/i.test(text)) {
    line1 = text.replace(/\s+Special$/i, "").trim();
    line2 = "Special";
  }

  /*
   * ------------------------------------------------------------
   * Occasion destination
   * ------------------------------------------------------------
   */
  const occasionSlug = occasionData.occasion.slug;

  const occasionHref = occasionSlug
    ? `/menu/occasion/${occasionSlug}`
    : "/menu/cakes";

  return (
    <section
      className="
        w-full
        px-0
        py-0
      "
      aria-label={`${text} occasion`}
    >
      <Link
        href={occasionHref}
        className="
          group
          relative
          block
          w-full
          overflow-hidden
          rounded-[15px]
          border
          border-[#D4AF37]/60
          bg-[#160F09]
          shadow-[0_5px_20px_rgba(212,175,55,0.16)]
          transition-all
          duration-300
          hover:border-[#D4AF37]/80
          hover:shadow-[0_6px_24px_rgba(212,175,55,0.22)]
          active:scale-[0.995]
        "
      >
        {/* ======================================================
            FESTIVAL FRAME
        ====================================================== */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            z-0
            opacity-[0.92]
          "
        >
          <Image
            src="/images/festival_banner_frame.png"
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 900px"
            className="
              object-cover
              object-center
            "
          />
        </div>

        {/* Dark overlay to keep text readable */}
        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            z-[1]
            bg-[linear-gradient(90deg,rgba(14,8,4,0.58),rgba(30,15,7,0.15),rgba(14,8,4,0.58))]
          "
        />

        {/* Soft center glow */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            z-[1]
            h-16
            w-48
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-[#D4AF37]/10
            blur-2xl
          "
        />

        {/* ======================================================
            CONTENT
        ====================================================== */}
        <div
          className="
            relative
            z-10
            flex
            min-h-[72px]
            flex-col
            items-center
            justify-center
            px-8
            py-2.5
            sm:min-h-[78px]
            sm:px-12
          "
        >
          {/* Decorative top/bottom ornaments */}
          <div
            aria-hidden="true"
            className="
              mb-1
              flex
              items-center
              justify-center
              gap-2
              opacity-90
            "
          >
            <span className="text-[7px] text-[#D4AF37]">✦</span>

            <div
              className="
                h-px
                w-10
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]/75
                to-transparent
                sm:w-14
              "
            />

            <span className="text-[8px] text-[#E6C675]">❖</span>

            <div
              className="
                h-px
                w-10
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]/75
                to-transparent
                sm:w-14
              "
            />

            <span className="text-[7px] text-[#D4AF37]">✦</span>
          </div>

          {/* Occasion title */}
          {line2 ? (
            <div className="flex flex-col items-center text-center">
              <h3
                className="
                  font-serif
                  text-[13px]
                  font-bold
                  leading-[1.15]
                  tracking-[0.035em]
                  text-[#F4E5B7]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]
                  sm:text-base
                "
              >
                {line1}
              </h3>

              <h4
                className="
                  mt-0.5
                  font-serif
                  text-[11px]
                  font-semibold
                  leading-[1.15]
                  tracking-[0.07em]
                  text-[#E4C76B]
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]
                  sm:text-sm
                "
              >
                {line2}
              </h4>
            </div>
          ) : (
            <h3
              className="
                font-serif
                text-[13px]
                font-bold
                leading-[1.15]
                tracking-[0.045em]
                text-[#F0DB9C]
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]
                sm:text-base
              "
            >
              {line1}
            </h3>
          )}

          {/* Bottom ornament + action cue */}
          <div
            className="
              mt-1
              flex
              items-center
              justify-center
              gap-2
              opacity-85
            "
          >
            <div
              aria-hidden="true"
              className="
                h-px
                w-9
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]/70
                to-transparent
                sm:w-12
              "
            />

            <span
              aria-hidden="true"
              className="
                text-[7px]
                text-[#D4AF37]
                sm:text-[8px]
              "
            >
              ✦
            </span>

            <span
              className="
                flex
                items-center
                gap-0.5
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.13em]
                text-[#EBD699]/85
                sm:text-[8px]
              "
            >
              View Cakes
              <ArrowRight className="h-2.5 w-2.5" />
            </span>

            <span
              aria-hidden="true"
              className="
                text-[7px]
                text-[#D4AF37]
                sm:text-[8px]
              "
            >
              ✦
            </span>

            <div
              aria-hidden="true"
              className="
                h-px
                w-9
                bg-gradient-to-r
                from-transparent
                via-[#D4AF37]/70
                to-transparent
                sm:w-12
              "
            />
          </div>
        </div>
      </Link>
    </section>
  );
}