// File: SignalSweepBar.tsx (status-aware)
import React, { useEffect, useRef, useState, useCallback } from "react";

type Status = "active" | "offline" | "focused" | "ooo";

type Props = {
  className?: string;
  height?: number;          // ~one row of text
  background?: string;
  anchors?: string[];       // brand tints
  fpsCap?: number;          // 30–60 (default 48)
  thickness?: number;       // core line thickness (px)
  cornerRadius?: number;
  status?: Status;          // NEW
};

export default function SignalSweepBar({
  className = "",
  height = 18,
  background = "transparent",
  anchors = ["#1B5862", "#277F64", "#4FAF83"],
  fpsCap = 48,
  thickness = 3,
  cornerRadius = 10,
  status = "offline",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number>(0);
  const [dpr, setDpr] = useState(1);
  const [isVisible, setIsVisible] = useState(true);

  // Status theme (speed px/s @ DPR=1, trail/halo strength, pulse cadence)
  const THEME: Record<Status, { speed: number; glow: number; pulseEveryMs: [min:number, max:number]; lineAlpha: number; }> = {
    active:  { speed: 120, glow: 1.0, pulseEveryMs: [900, 1800], lineAlpha: 0.55 },
    offline: { speed: 90,  glow: 0.85, pulseEveryMs: [1500, 4000], lineAlpha: 0.45 },
    focused: { speed: 60,  glow: 0.65, pulseEveryMs: [3500, 7000], lineAlpha: 0.35 },
    ooo:     { speed: 38,  glow: 0.55, pulseEveryMs: [6000, 11000], lineAlpha: 0.30 },
  };
  const theme = THEME[status];

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Visibility optimization
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Size to parent
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

    const W = c.width, H = c.height;
    const y = Math.floor(H / 2);

    // Colors
    const base = anchors[0] ?? "#1B5862";
    const mid  = anchors[1] ?? "#277F64";
    const hi   = anchors[2] ?? "#4FAF83";

    // Micro-pulses
    const randDelay = () => Math.random() * (theme.pulseEveryMs[1] - theme.pulseEveryMs[0]) + theme.pulseEveryMs[0];
    const pulses = Array.from({ length: 4 }, () => ({
      x: Math.random() * W,
      born: performance.now() + randDelay(),
      width: (Math.random() * 12 + 8) * dpr,
      lifeMs: 600,
    }));

    let headX = 0;
    let lastT = 0;
    const minDt = 1000 / Math.min(Math.max(fpsCap, 24), 60);

    // helpers
    const hexToRgba = (hex: string, a: number) => {
      const { r, g, b } = hexToRgb(hex); return `rgba(${r},${g},${b},${a})`;
    };
    function hexToRgb(hex: string) {
      let c = hex.replace("#", "");
      if (c.length === 3) c = c.split("").map(ch => ch + ch).join("");
      const num = parseInt(c, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    const clamp = (x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));

    function frame(t: number) {
      if (!lastT) lastT = t;
      const dt = t - lastT;
      if (dt < minDt || !isVisible) { 
        rafRef.current = requestAnimationFrame(frame); 
        return; 
      }
      lastT = t;

      ctx.clearRect(0, 0, W, H);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        roundRect(ctx, 0, 0, W, H, 10 * dpr);
        ctx.fill();
      }

      // base track
      const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
      bgGrad.addColorStop(0, hexToRgba(base, 0.06));
      bgGrad.addColorStop(0.5, hexToRgba(mid, 0.09));
      bgGrad.addColorStop(1, hexToRgba(base, 0.06));
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 0, Math.floor(H * 0.5 - thickness * dpr), W, Math.ceil(thickness * 2 * dpr), 10 * dpr);
      ctx.fill();

      // sweep
      const wobble = 0.75 + 0.25 * Math.sin(t * 0.0017); // gentle variation
      headX += (theme.speed * wobble * dpr) * (dt / 1000);
      if (headX > W + 80 * dpr) headX = -40 * dpr;

      const trail = ctx.createLinearGradient(headX - 100 * dpr, 0, headX + 12 * dpr, 0);
      trail.addColorStop(0, hexToRgba(base, 0));
      trail.addColorStop(0.35, hexToRgba(mid, 0.18 * theme.glow));
      trail.addColorStop(0.9, hexToRgba(hi, theme.lineAlpha * theme.glow));
      trail.addColorStop(1, hexToRgba(hi, 0));
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = (12 + 6 * theme.glow) * dpr;
      ctx.shadowColor = hexToRgba(hi, 0.28 * theme.glow);
      ctx.strokeStyle = trail;
      ctx.lineWidth = Math.max(1, (thickness + (status === "active" ? 0.5 : status === "focused" ? -0.5 : 0)) * dpr);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(clamp(headX - 120 * dpr, 0, W), y);
      ctx.lineTo(clamp(headX + 8 * dpr, 0, W), y);
      ctx.stroke();
      ctx.restore();

      // pulses
      for (const p of pulses) {
        const age = t - p.born;
        if (age > 0 && age < p.lifeMs) {
          const a = 1 - age / p.lifeMs;
          const g = ctx.createRadialGradient(p.x, y, 1, p.x, y, p.width);
          g.addColorStop(0, hexToRgba(hi, 0.16 * a * theme.glow));
          g.addColorStop(1, hexToRgba(hi, 0));
          ctx.fillStyle = g;
          ctx.fillRect(p.x - p.width, y - p.width, p.width * 2, p.width * 2);
        } else if (age >= p.lifeMs) {
          // schedule next pulse
          p.x = Math.random() * W;
          p.born = t + randDelay();
          p.width = (Math.random() * 12 + 8) * dpr;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    if (reduced) {
      // Static bar only
      const bgGrad = ctx.createLinearGradient(0, 0, W, 0);
      bgGrad.addColorStop(0, hexToRgba(base, 0.06));
      bgGrad.addColorStop(0.5, hexToRgba(mid, 0.09));
      bgGrad.addColorStop(1, hexToRgba(base, 0.06));
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 0, Math.floor(H * 0.5 - thickness * dpr), W, Math.ceil(thickness * 2 * dpr), 10 * dpr);
      ctx.fill();
      return;
    }

    rafRef.current = requestAnimationFrame(frame);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [anchors.join(","), dpr, background, fpsCap, thickness, cornerRadius, status, isVisible]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height }}
      aria-label={`Message monitoring status: ${status}`}
      role="img"
    >
      <canvas ref={canvasRef} className="block w-full" />
    </div>
  );
}

/* helpers */
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