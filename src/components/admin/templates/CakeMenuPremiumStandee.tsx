"use client";

import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";

export interface CakeMenuPremiumStandeeProps {
  restaurantName?: string;
  tagline?: string;
  logoUrl?: string;
  targetUrl: string;
  tableNumber?: string;
  includeLogo?: boolean;
  fgColor?: string;
  bgColor?: string;
  size?: "preview" | "print";
}

export const CakeMenuPremiumStandee = forwardRef<
  HTMLDivElement,
  CakeMenuPremiumStandeeProps
>(
  (
    {
      restaurantName = "Raman Sweet Bakery",
      tagline = "& FAMILY RESTAURANT",
      targetUrl,
      tableNumber,
      includeLogo = true,
      fgColor = "#2C170E",
      bgColor = "transparent",
      size = "preview",
    },
    ref
  ) => {
    const qrForeground =
      fgColor === "#1A0F0A" || !fgColor ? "#2C170E" : fgColor;

    return (
      <div
        ref={ref}
        id="cake-menu-premium-standee"
        className="standee-card-root relative mx-auto w-full max-w-[460px] select-none overflow-hidden rounded-[20px] shadow-2xl transition-all"
        style={{
          aspectRatio: "682 / 1024",
          backgroundColor: "#FAF6EF",
          boxShadow:
            "0 32px 64px -16px rgba(44, 23, 14, 0.45), 0 0 0 1px rgba(140, 94, 61, 0.2)",
        }}
      >
        {/* =========================================================
            BASE STANDEE ARTWORK
            ========================================================= */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/standee_cake_menu_blank_qr.png"
          alt="Raman Sweet Bakery Cake Menu Premium Acrylic Standee"
          className="absolute inset-0 h-full w-full block pointer-events-none"
          style={{
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />

        {/* =========================================================
            REAL DYNAMIC QR CODE
            ========================================================= */}
        <div
          className="absolute z-20 flex items-center justify-center pointer-events-auto"
          style={{
            left: "50%",
            top: "43.7%",
            transform: "translate(-50%, -50%)",
            width: "29.5%",
            aspectRatio: "1 / 1",
          }}
        >
          <QRCodeSVG
            value={targetUrl}
            size={size === "print" ? 250 : 160}
            fgColor={qrForeground}
            bgColor="#FFFFFF"
            level="H"
            includeMargin={false}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            imageSettings={
              includeLogo
                ? {
                  src:
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'><circle cx='24' cy='24' r='23' fill='%232C170E'/><path d='M19 18C17 18 16 16 16 14C16 12 18 11 20 11C21 9 23 8 25 8C27 8 29 9 30 11C32 11 34 12 34 14C34 16 32 18 31 18Z' fill='none' stroke='%23FAF6F0' stroke-width='1.8' stroke-linejoin='round'/><path d='M18 18H32V20H18Z' fill='%23FAF6F0'/><text x='24' y='34' font-family='serif' font-size='14' font-weight='bold' fill='%23FAF6F0' text-anchor='middle'>R</text></svg>",
                  x: undefined,
                  y: undefined,
                  height: 32,
                  width: 32,
                  excavate: true,
                }
                : undefined
            }
          />
        </div>

        {/* =========================================================
            OPTIONAL TABLE / COUNTER NUMBER
            ========================================================= */}
        {tableNumber && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: "50%",
              top: "32.8%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <span className="inline-block rounded-full border border-[#8C5E3D] bg-[#FDFBF7] px-3 py-0.5 text-[9.5px] font-bold text-[#2C170E] shadow-sm">
              {tableNumber}
            </span>
          </div>
        )}
      </div>
    );
  }
);

CakeMenuPremiumStandee.displayName = "CakeMenuPremiumStandee";