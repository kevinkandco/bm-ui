import React, { useEffect, useRef, useState } from "react";

/**
 * LiquidLightCore
 * -------------------------------------------------------
 * A fluid, gradient-lit orb that:
 *  - Morphs organically (noise-driven)
 *  - Shifts gradients over time (aurora/oil-on-water vibe)
 *  - Auto-selects palette by time-of-day (or override via props)
 *  - Mobile-first, GPU-light (2D canvas), DPR-capped
 *
 * Usage:
 *   <LiquidLightCore
 *     className="mx-auto w-full max-w-[480px]"
 *     height={220}
 *     anchors={["#1B5862","#277F64","#4FAF83"]} // optional brand anchors
 *     mode="auto" // "auto" | "morning" | "afternoon" | "evening" | "night"
 *   />
 */

type Mode = "auto" | "morning" | "afternoon" | "evening" | "night";

export default function LiquidLightCore({
  width,
  height = 220,
  className = "",
  background = "transparent",
  anchors = ["#1B5862", "#277F64", "#4FAF83"],
  mode = "auto" as Mode,
  fpsCap = 60,
}: {
  width?: number;
  height?: number;
  className?: string;
  background?: string;
  anchors?: string[];
  mode?: Mode;
  fpsCap?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dpr, setDpr] = useState(1);

  // Resize & DPR
  useEffect(() => {
    const update = () => {
      const device = Math.min(window.devicePixelRatio || 1, 2);
      setDpr(device);
      const c = canvasRef.current;
      if (!c) return;
      let cssW: number;
      if (!width && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cssW = Math.floor(rect.width);
      } else {
        cssW = Math.floor(width || 320);
      }
      c.style.width = `${cssW}px`;
      c.style.height = `${height}px`;
      c.width = Math.floor(cssW * device);
      c.height = Math.floor(height * device);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", update);
    };
  }, [width, height]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Palette selection
    const palette = getPalette(mode, anchors);

    // Blob configuration
    const POINTS = 64;                 // smoothness of the blob
    const baseR = Math.min(c.width, c.height) * 0.34;
    const center = { x: c.width / 2, y: c.height / 2 };

    // Frame timing cap
    let last = 0;
    const minDt = 1000 / Math.min(Math.max(fpsCap, 24), 60);

    // Animation
    let raf = 0;
    function frame(t: number) {
      if (t - last < minDt) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = t;

      // Clear
      ctx.clearRect(0, 0, c.width, c.height);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, c.width, c.height);
      }

      // Time evolution
      const time = t * 0.0012;

      // Compute blob path
      const path = new Path2D();
      for (let i = 0; i <= POINTS; i++) {
        const theta = (i / POINTS) * Math.PI * 2;
        // Noise-driven radius (stacked sines -> mobile-cheap “noise”)
        const n =
          Math.sin(theta * 3 + time * 0.7) * 0.12 +
          Math.sin(theta * 5 - time * 0.4) * 0.08 +
          Math.sin(theta * 11 + time * 0.2) * 0.04;
        const r = baseR * (1 + n);
        const x = center.x + Math.cos(theta) * r;
        const y = center.y + Math.sin(theta) * r;
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }

      // Gradient that drifts around (aurora-like)
      const drift = {
        x: center.x + Math.cos(time * 0.8) * baseR * 0.35,
        y: center.y + Math.sin(time * 0.6) * baseR * 0.25,
      };
      const grad = ctx.createRadialGradient(
        drift.x,
        drift.y,
        baseR * 0.15,
        center.x,
        center.y,
        baseR * 1.4
      );
      const stops = dynamicStops(palette, time);
      stops.forEach(s => grad.addColorStop(s.stop, s.color));

      // Fill blob with gradient
      ctx.save();
      ctx.fillStyle = grad as unknown as string;
      ctx.filter = "blur(0px)";
      ctx.fill(path);
      ctx.restore();

      // Soft outer glow (adds depth)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 24 * dpr;
      ctx.shadowColor = hexToRgba(stops[1].color, 0.35);
      ctx.fillStyle = hexToRgba(stops[0].color, 0.25);
      ctx.fill(path);
      ctx.restore();

      // Inner highlight pass (subtle caustics)
      ctx.save();
      ctx.clip(path);
      const highlight = ctx.createRadialGradient(
        center.x - baseR * 0.18 * Math.cos(time * 0.9),
        center.y - baseR * 0.18 * Math.sin(time * 0.9),
        2,
        center.x,
        center.y,
        baseR * 0.8
      );
      highlight.addColorStop(0, hexToRgba("#ffffff", 0.18));
      highlight.addColorStop(1, hexToRgba("#ffffff", 0));
      ctx.fillStyle = highlight as unknown as string;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.restore();

      // Vignette (very subtle)
      ctx.save();
      const vg = ctx.createRadialGradient(center.x, center.y, baseR * 0.2, center.x, center.y, baseR * 1.6);
      vg.addColorStop(0, hexToRgba("#000", 0));
      vg.addColorStop(1, hexToRgba("#000", 0.12));
      ctx.fillStyle = vg as unknown as string;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.restore();

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [dpr, background, anchors.join(","), mode, fpsCap]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full rounded-[28px]"
        role="img"
        aria-label="Liquid light AI core animation"
      />
    </div>
  );
}

/* ---------- Palette & Color helpers ---------- */

function getPalette(mode: Mode, anchors: string[]) {
  const now = new Date();
  const h = now.getHours();
  const resolved: Mode =
    mode !== "auto"
      ? mode
      : h >= 6 && h < 11
      ? "morning"
      : h >= 11 && h < 17
      ? "afternoon"
      : h >= 17 && h < 21
      ? "evening"
      : "night";

  const brand = anchors.length ? anchors : ["#1B5862", "#277F64", "#4FAF83"];

  switch (resolved) {
    case "morning":
      return [
        tint(brand[2] ?? "#4FAF83", 0.25), // soft mint
        "#FFD9A0",                         // warm light
        "#FFF2E0",                         // pale sunrise
      ];
    case "afternoon":
      return [brand[0], brand[1], brand[2]];
    case "evening":
      return ["#5B4F9E", "#7B66C6", "#C4A1FF"]; // calming purples
    case "night":
    default:
      return ["#0E1214", mix(brand[0], "#0E1214", 0.6), "#1C1F24"]; // deep, low-contrast
  }
}

// Generate slightly evolving gradient stops
function dynamicStops(palette: string[], t: number) {
  // oscillate stop positions a bit so it feels alive
  const wob = (p: number, speed: number, amt: number) =>
    clamp01(p + Math.sin(t * speed + p * Math.PI * 2) * amt);

  const base = [
    { stop: 0.0, color: palette[1] || "#ffffff" },
    { stop: 0.55, color: palette[0] || "#cccccc" },
    { stop: 1.0, color: palette[2] || "#000000" },
  ];

  return base
    .map((s, i) => ({
      stop: wob(s.stop, 0.35 + i * 0.1, 0.06),
      color: s.color,
    }))
    .sort((a, b) => a.stop - b.stop);
}

function hexToRgba(hex: string, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function hexToRgb(hex: string) {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((ch) => ch + ch).join("");
  const num = parseInt(c, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
function clamp01(x: number) {
  return Math.max(0, Math.min(1, x));
}
function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bch = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bch).toString(16).slice(1)}`;
}
function tint(hex: string, amt: number) {
  return mix(hex, "#ffffff", amt);
}
