import React from "react";

/** The LearnHub orbit mark, same traced geometry as public/brand/logo-mark.svg. */
export const Mark: React.FC<{ size: number; color: string; style?: React.CSSProperties }> = ({ size, color, style }) => (
  <svg viewBox="0 0 420 420" width={size} height={size} fill={color} style={style}>
    <path fillRule="evenodd" d="M233.52 333.58A145 145 0 1 1 332.63 267.87A67.3 67.3 0 0 0 233.52 333.58ZM133 190.5a77 77 0 1 0 154 0a77 77 0 1 0 -154 0Z" />
    <path d="M253 327a47.5 47.5 0 1 0 95 0a47.5 47.5 0 1 0 -95 0Z" />
  </svg>
);

/**
 * The reference's coin: a metallic disc carrying the mark, spinning on its Y axis.
 * `turn` is in degrees; the disc's face reads as a coin because its shading
 * darkens as it turns edge-on.
 */
export const Coin: React.FC<{ size: number; turn: number; dark?: boolean }> = ({ size, turn, dark }) => {
  const edge = Math.abs(Math.cos((turn * Math.PI) / 180));
  return (
    <div style={{ width: size, height: size, perspective: size * 6, flex: "none" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          rotate: `y ${turn}deg`,
          display: "grid",
          placeItems: "center",
          background: dark
            ? `radial-gradient(circle at 35% 30%, #FFFFFF, #C9D2E3 45%, #8A93A6 100%)`
            : `radial-gradient(circle at 35% 30%, #FFFFFF, #DDE3EE 50%, #A9B3C6 100%)`,
          boxShadow: dark ? `0 0 ${size * 0.6}px ${size * 0.08}px rgba(255,255,255,${0.18 * edge + 0.06})` : `0 2px 6px rgba(11,15,26,.18)`,
          filter: `brightness(${0.7 + 0.3 * edge})`,
        }}
      >
        <Mark size={size * 0.62} color="#1A2234" />
      </div>
    </div>
  );
};
