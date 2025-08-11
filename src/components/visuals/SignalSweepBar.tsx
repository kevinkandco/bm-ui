import React, { useEffect, useRef, useState } from "react";

/**
 * SignalSweepBar
 * -------------------------------------------------------
 * A subtle horizontal activity line:
 *  - Thin glow line with a soft sweep head and trailing fade
 *  - Occasional micro-pulses (very faint)
 *  - Noise-based speed variance so it doesn't feel looped
 *  - DPR-capped, mobile-friendly, honors prefers-reduced-motion
 *
 * Usage:
 *   <SignalSweepBar
 *     className="mx-auto"
 *     height={18}                 // ~one row of text
 *     anchors={["#1B5862","#277F64","#4FAF83"]} // optional brand tints
 *   />
 */

type Props = {
  className?: string;
  height?: number;          // CSS px height (default 18)
  background?: string;      // behind bar; often "transparent"
  anchors?: string[];       // brand colors for glow
  fpsCap?: number;          // 30–60 (default 48)
  speed?: number;           // base sweep speed (px/s @ DPR=1)
  thickness?: number;       // core line thickness in CSS px
  cornerRadius?: number;    // container rounding (px)
};

export default function SignalSweepBar({
  className = "",
  height = 18,
  background = "transparent",
  anchors = ["#1B5862", "#277F64", "#4FAF83"],
  fpsCap = 48,
  speed = 90,
  thickness = 3,
  cornerRadius = 10,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dpr, setDpr] = useState(1);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Fit canvas to parent width and given height
  useEffect(() => {
    const update = () => {
      const device = Math.min(window.devicePixelRatio || 1, 2);
      setDpr(device);
      const c = canvasRef.current;
      if (!c) return;
      let cssW = 320;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        cssW = Math.max(80, Math.floor(rect.width));
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
  }, [height]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    const W = c.width;
    const H = c.height;

    // Baseline y for the line
    const y = Math.floor(H / 2);

    // Micro-pulses
    const pulses = Array.from({ length: 5 }, () => ({
      x: Math.random() * W,
      life: 0,
      delay: Math.random() * 4000 + 1500, // ms
      width: (Math.random() * 14 + 8) * dpr,
    }));

    // Sweep head state
    let headX = 0;
    let lastT = 0;
    const minDt = 1000 / Math.min(Math.max(fpsCap, 24), 60);

    // Color setup
    const base = anchors[0] ?? "#1B5862";
    const mid = anchors[1] ?? "#277F64";
    const hi = anchors[2] ?? "#4FAF83";

    // Helpers
    const hexToRgba = (hex: string, a: number) => {
      const { r, g, b } = hexToRgb(hex);
      return `rgba(${r},${g},${b},${a})`;
    };
    function hexToRgb(hex: string) {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
      const num = parseInt(c, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

    function frame(t: number) {
      if (!lastT) lastT = t;
      const dt = t - lastT;
      if (dt < minDt) {
        requestAnimationFrame(frame);
        return;
      }
      lastT = t;

      // Clear
      ctx.clearRect(0, 0, W, H);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        roundRect(ctx, 0, 0, W, H, cornerRadius * dpr);
        ctx.fill();
      }

      // Quiet background track (very faint gradient band)
      const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
      bgGrad.addColorStop(0, hexToRgba(base, 0.06));
      bgGrad.addColorStop(0.5, hexToRgba(mid, 0.09));
      bgGrad.addColorStop(1, hexToRgba(base, 0.06));
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 0, Math.floor(H * 0.5 - thickness * dpr), W, Math.ceil(thickness * 2 * dpr), cornerRadius * dpr);
      ctx.fill();

      // Sweep head progression with slight speed wobble
      const wobble = 0.75 + 0.25 * Math.sin(t * 0.0017);
      headX += (speed * wobble * dpr) * (dt / 1000);
      if (headX > W + 80 * dpr) headX = -40 * dpr;

      // Glow trail
      const trail = ctx.createLinearGradient(headX - 100 * dpr, 0, headX + 12 * dpr, 0);
      trail.addColorStop(0, hexToRgba(base, 0));
      trail.addColorStop(0.35, hexToRgba(mid, 0.20));
      trail.addColorStop(0.9, hexToRgba(hi, 0.55));
      trail.addColorStop(1, hexToRgba(hi, 0));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 12 * dpr;
      ctx.shadowColor = hexToRgba(hi, 0.35);
      ctx.strokeStyle = trail;
      ctx.lineWidth = Math.max(1, thickness * dpr);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(clamp(headX - 120 * dpr, 0, W), y);
      ctx.lineTo(clamp(headX + 8 * dpr, 0, W), y);
      ctx.stroke();
      ctx.restore();

      // Micro-pulses along the track (very subtle)
      for (const p of pulses) {
        p.life += dt;
        if (p.life > p.delay) {
          // render
          const a = 1 - (p.life - p.delay) / 600; // fade out over 600ms
          if (a > 0) {
            const g = ctx.createRadialGradient(p.x, y, 1, p.x, y, p.width);
            g.addColorStop(0, hexToRgba(hi, 0.18 * a));
            g.addColorStop(1, hexToRgba(hi, 0));
            ctx.fillStyle = g;
            ctx.fillRect(p.x - p.width, y - p.width, p.width * 2, p.width * 2);
          } else {
            // reset
            p.x = Math.random() * W;
            p.life = 0;
            p.delay = Math.random() * 4000 + 1500;
            p.width = (Math.random() * 14 + 8) * dpr;
          }
        }
      }

      requestAnimationFrame(frame);
    }

    if (reduced) {
      // Static: faint gradient bar only
      ctx.clearRect(0, 0, W, H);
      const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
      bgGrad.addColorStop(0, hexToRgba(base, 0.06));
      bgGrad.addColorStop(0.5, hexToRgba(mid, 0.09));
      bgGrad.addColorStop(1, hexToRgba(base, 0.06));
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 0, Math.floor(H * 0.5 - thickness * dpr), W, Math.ceil(thickness * 2 * dpr), cornerRadius * dpr);
      ctx.fill();
      return;
    }

    requestAnimationFrame(frame);
  }, [anchors.join(","), dpr, background, fpsCap, speed, thickness, cornerRadius, reduced]);

  return (
    <div ref={containerRef} className={className} style={{ height }}>
      <canvas ref={canvasRef} className="block w-full" role="img" aria-label="Background message monitoring indicator" />
    </div>
  );
}

/* ---- helpers ---- */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}
