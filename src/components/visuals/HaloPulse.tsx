import React, { useEffect, useRef, useState } from "react";

/**
 * HaloPulse
 * -------------------------------------------------------
 * Compact, full-circle AI “halo”:
 *  - Soft, blurred gradient blobs that drift + morph
 *  - Subtle halo ring + understated audio-wave arc
 *  - Mobile-first, DPR-capped, reduced-motion aware
 *
 * Usage:
 *   <HaloPulse
 *     className="mx-auto"
 *     size={148}
 *     anchors={["#1B5862", "#277F64", "#4FAF83"]} // optional brand anchors
 *     background="#0E1214" // or "transparent"
 *   />
 */

type Props = {
  size?: number;              // CSS px size (width = height)
  className?: string;
  background?: string;        // behind the circle; often transparent
  anchors?: string[];         // brand colors to influence the gradient
  fpsCap?: number;            // 30–60 (default 48)
  intensity?: number;         // 0.6–1.4 scaling of glow strength
};

export default function HaloPulse({
  size = 148,
  className = "",
  background = "transparent",
  anchors = ["#1B5862", "#277F64", "#4FAF83"],
  fpsCap = 48,
  intensity = 1.0,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dpr, setDpr] = useState(1);

  // Reduced motion
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Fit canvas to CSS size * DPR
  useEffect(() => {
    const update = () => {
      const device = Math.min(window.devicePixelRatio || 1, 2);
      setDpr(device);
      const c = canvasRef.current;
      if (!c) return;
      c.style.width = `${size}px`;
      c.style.height = `${size}px`;
      c.width = Math.floor(size * device);
      c.height = Math.floor(size * device);
    };
    update();
    const ro = new ResizeObserver(update);
    if (canvasRef.current?.parentElement) ro.observe(canvasRef.current.parentElement);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", update);
    };
  }, [size]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    if (!ctx) return;

    const W = c.width;
    const H = c.height;
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.min(W, H) * 0.48;

    // Blob seeds
    const seeds = [
      { phase: Math.random() * Math.PI * 2, speed: 0.35, amp: 0.32, col: anchors[0] ?? "#1B5862" },
      { phase: Math.random() * Math.PI * 2, speed: 0.28, amp: 0.26, col: anchors[1] ?? "#277F64" },
      { phase: Math.random() * Math.PI * 2, speed: 0.22, amp: 0.22, col: anchors[2] ?? "#4FAF83" },
    ];

    // Timing
    let last = 0;
    const minDt = 1000 / Math.min(Math.max(fpsCap, 24), 60);
    let raf = 0;

    function frame(t: number) {
      if (!last) last = t;
      const dt = t - last;
      if (dt < minDt) {
        raf = requestAnimationFrame(frame);
        return;
      }
      last = t;

      // Clear
      ctx.clearRect(0, 0, W, H);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, W, H);
      }

      // Clip to circle so the edge is perfectly round
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      // Soft gradient blobs (3 passes)
      const time = t * 0.0012;
      for (let i = 0; i < seeds.length; i++) {
        const s = seeds[i];
        const theta = s.phase + time * s.speed;
        const r = radius * (0.35 + s.amp * 0.35);
        const bx = cx + Math.cos(theta) * radius * 0.35;
        const by = cy + Math.sin(theta * 0.9) * radius * 0.28;

        const g = ctx.createRadialGradient(bx, by, 2, bx, by, r * 1.8);
        const c1 = tint(s.col, 0.3);
        const c2 = mix(s.col, "#ffffff", 0.08);
        g.addColorStop(0, hexToRgba(c1, 0.70 * intensity));
        g.addColorStop(0.55, hexToRgba(c2, 0.25 * intensity));
        g.addColorStop(1, hexToRgba("#000000", 0));

        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = g;
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
        ctx.globalCompositeOperation = "source-over";
      }

      // Inner caustic highlight
      const hi = ctx.createRadialGradient(
        cx - radius * 0.18 * Math.cos(time * 0.9),
        cy - radius * 0.18 * Math.sin(time * 0.7),
        2,
        cx,
        cy,
        radius * 0.85
      );
      hi.addColorStop(0, hexToRgba("#ffffff", 0.10 * intensity));
      hi.addColorStop(1, hexToRgba("#ffffff", 0));
      ctx.fillStyle = hi;
      ctx.fillRect(0, 0, W, H);

      // Subtle audio-wave arc (very faint)
      const arcProgress = (Math.sin(time * 1.4) + 1) / 2; // 0..1
      const arcStart = -Math.PI * 0.25;
      const arcEnd = arcStart + Math.PI * (0.5 + 0.35 * arcProgress);

      ctx.lineWidth = Math.max(1, Math.floor(1.2 * dpr));
      ctx.strokeStyle = hexToRgba("#FFFFFF", 0.10);
      ctx.beginPath();
      // slight inner radius for the arc
      const rr = radius * 0.82;
      for (let i = 0; i <= 42; i++) {
        const a = arcStart + (i / 42) * (arcEnd - arcStart);
        const wobble = Math.sin(a * 6 + time * 2.4) * radius * 0.008;
        const x = cx + Math.cos(a) * (rr + wobble);
        const y = cy + Math.sin(a) * (rr + wobble);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore(); // end clip

      // Halo ring on top (crisp edge)
      ctx.save();
      ctx.lineWidth = Math.max(1, Math.floor(1.6 * dpr));
      const ringAlpha = 0.18 * intensity;
      ctx.strokeStyle = hexToRgba("#FFFFFF", ringAlpha);
      ctx.beginPath();
      ctx.arc(cx, cy, radius - ctx.lineWidth, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Soft outside glow
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 18 * dpr;
      ctx.shadowColor = hexToRgba(anchors[2] ?? "#4FAF83", 0.25 * intensity);
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.98, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(anchors[0] ?? "#1B5862", 0.10 * intensity);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(frame);
    }

    if (prefersReduced) {
      // Render one static frame
      frame(performance.now());
      return;
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [dpr, background, anchors.join(","), fpsCap, intensity, prefersReduced]);

  return (
    <div className={className} style={{ width: size, height: size }}>
      <canvas
        ref={canvasRef}
        className="block"
        aria-label="AI halo animation"
        role="img"
      />
    </div>
  );
}

/* ----------------- color helpers ----------------- */
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
function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bch = Math.round(ca.b + (cb.b - ca.b) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + bch).toString(16).slice(1)}`;
}
function tint(hex: string, amt = 0.2) {
  return mix(hex, "#ffffff", amt);
}
