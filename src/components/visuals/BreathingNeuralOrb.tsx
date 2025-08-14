import React, { useEffect, useRef, useState } from "react";

interface BreathingNeuralOrbProps {
  width?: number;
  height?: number;
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  brandColors?: string[];
  background?: string;
}

/**
 * BreathingNeuralOrb
 * -------------------------------------------------------
 * A performant, mobile-first canvas orb with:
 *  - Soft breathing outer glow (subtle scale + alpha pulse)
 *  - Inner particle "neurons" with proximity connections
 *  - Gentle noise-driven drift (feels organic, non-looping)
 *  - Light interactivity: touch/mouse slightly attracts particles
 *  - Tailwind-friendly container and props for easy theming
 */
export default function BreathingNeuralOrb({
  width,
  height = 220,
  className = "",
  particleCount = 48,
  connectionDistance = 64,
  brandColors = ["#1B5862", "#277F64", "#4FAF83"],
  background = "transparent",
}: BreathingNeuralOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const update = () => {
      const device = Math.min(window.devicePixelRatio || 1, 2);
      setDpr(device);
      const c = canvasRef.current;
      if (!c) return;

      if (!width && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        c.style.width = `${Math.floor(rect.width)}px`;
        c.style.height = `${height}px`;
        c.width = Math.floor(rect.width * device);
        c.height = Math.floor(height * device);
      } else if (width) {
        c.style.width = `${width}px`;
        c.style.height = `${height}px`;
        c.width = Math.floor(width * device);
        c.height = Math.floor(height * device);
      }
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
    let raf = 0;

    const N = particleCount;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * c.width,
      y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 1 + Math.random() * (2 * dpr),
    }));

    const pointer = { x: c.width / 2, y: c.height / 2, active: false } as { x: number; y: number; active: boolean };
    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = c.getBoundingClientRect();
      const isTouch = (e as TouchEvent).touches !== undefined;
      const px = isTouch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const py = isTouch ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
      pointer.x = (px - rect.left) * dpr;
      pointer.y = (py - rect.top) * dpr;
      pointer.active = true;
    };
    const onLeave = () => (pointer.active = false);
    c.addEventListener("mousemove", onMove as EventListener, { passive: true } as AddEventListenerOptions);
    c.addEventListener("touchmove", onMove as EventListener, { passive: true } as AddEventListenerOptions);
    c.addEventListener("mouseleave", onLeave as EventListener);
    c.addEventListener("touchend", onLeave as EventListener);

    const noise2 = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.002 + t * 0.6) * 0.5 +
        Math.sin(y * 0.0023 - t * 0.5) * 0.3 +
        Math.sin((x + y) * 0.0012 + t * 0.4) * 0.2
      );
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const gradientStops = brandColors.length ? brandColors : ["#66e", "#6e6", "#e6e"];

    const maxConn = connectionDistance * dpr;

    function drawGlow(ctx2: CanvasRenderingContext2D, w: number, h: number, t: number) {
      const cx = w / 2;
      const cy = h / 2;
      const breathe = (Math.sin(t * 0.0016) + 1) / 2;
      const scale = lerp(0.9, 1.05, breathe);
      const alpha = lerp(0.28, 0.42, breathe);
      const r = Math.min(w, h) * 0.46 * scale;
      const g = ctx2.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
      g.addColorStop(0, hexToRgba(gradientStops[1 % gradientStops.length], alpha));
      g.addColorStop(0.6, hexToRgba(gradientStops[0], alpha * 0.6));
      g.addColorStop(1, hexToRgba("#000000", 0));

      ctx2.globalCompositeOperation = "lighter";
      ctx2.beginPath();
      ctx2.fillStyle = g as unknown as string;
      ctx2.arc(cx, cy, r, 0, Math.PI * 2);
      ctx2.fill();
      ctx2.globalCompositeOperation = "source-over";
    }

    function step() {
      const t = performance.now();

      const w = c.width;
      const h = c.height;
      ctx.clearRect(0, 0, w, h);
      if (background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }
      drawGlow(ctx, w, h, t);

      for (const p of particles) {
        const n = noise2(p.x, p.y, t * 0.0015);
        p.vx += Math.cos(n) * 0.02;
        p.vy += Math.sin(n) * 0.02;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist2 = dx * dx + dy * dy;
          const pull = Math.min(0.04, 40 / (dist2 + 1000));
          p.vx += dx * pull * 0.0006;
          p.vy += dy * pull * 0.0006;
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        const speed = Math.hypot(p.vx, p.vy);
        const maxSp = 0.45 * dpr;
        if (speed > maxSp) {
          p.vx = (p.vx / speed) * maxSp;
          p.vy = (p.vy / speed) * maxSp;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }

      ctx.lineWidth = Math.max(0.6 * dpr, 0.6);
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxConn) {
            const tAlpha = 1 - d / maxConn;
            const col = lerpColor(
              gradientStops[2 % gradientStops.length],
              gradientStops[0],
              0.5 + 0.5 * tAlpha
            );
            ctx.strokeStyle = hexToRgba(col, 0.25 * tAlpha);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const col = gradientStops[((p.x + p.y) % gradientStops.length) | 0];
        ctx.beginPath();
        ctx.fillStyle = hexToRgba(col, 0.85);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("mousemove", onMove as EventListener);
      c.removeEventListener("touchmove", onMove as EventListener);
      c.removeEventListener("mouseleave", onLeave as EventListener);
      c.removeEventListener("touchend", onLeave as EventListener);
    };
  }, [particleCount, connectionDistance, brandColors, background, dpr]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ height }}>
      <canvas
        ref={canvasRef}
        className="block w-full h-full rounded-full"
        role="img"
        aria-label="Animated neural orb"
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow: "inset 0 0 40px rgba(0,0,0,0.35), inset 0 0 120px rgba(0,0,0,0.15)",
        }}
      />
    </div>
  );
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

function lerpColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const bch = Math.round(ca.b + (cb.b - ca.b) * t);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bch).toString(16).slice(1);
}
