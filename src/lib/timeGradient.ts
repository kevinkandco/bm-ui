// Time-of-day gradient background system
// Smoothly blends gradient colors throughout the day based on current time

interface GradientPhase {
  start: [number, number]; // [hour, minute]
  stops: [string, string, string]; // 3-stop gradient colors
}

interface GradientConfig {
  selector?: string;
  angle?: string;
  tickMs?: number;
}

export function attachTimeGradient({
  selector = '.main-content',   // change if your main container differs
  angle = '160deg',
  tickMs = 30000                // update every 30s (cheap + smooth enough)
}: GradientConfig = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Brand green gradient anchors and new time-of-day colors
  const BRAND_DEEP = '#1B5862';
  const BRAND_MID  = '#277F64';
  const BRAND_DARK = '#0E1214'; // Bottom-right fade target

  // Day phases (24h) with color stops for a 3-stop gradient
  // All gradients fade to #0E1214 in bottom-right corner
  const phases: GradientPhase[] = [
    // Morning (warm & sunny) - 6am to 11am
    {
      start: [6, 0],   // 06:00
      stops: ['#FFD580', '#FFB347', BRAND_DARK]
    },
    // Afternoon (focused brand greens) - 11am to 5pm
    {
      start: [11, 0],  // 11:00
      stops: [BRAND_DEEP, BRAND_MID, BRAND_DARK]
    },
    // Evening (calming purples) - 5pm to 10pm
    {
      start: [17, 0],  // 17:00
      stops: ['#4B3F72', '#6B5B95', BRAND_DARK]
    },
    // Night (deep + low contrast) - 10pm to 6am
    {
      start: [22, 0],  // 22:00
      stops: [BRAND_DARK, '#1B1F28', BRAND_DARK]
    }
  ];

  // --- helpers ------------------------------------------------------------
  const toMin = (h: number, m: number) => h * 60 + m;
  
  const hexToRgb = (hex: string): [number, number, number] => {
    const m = hex.replace('#','');
    const n = m.length === 3
      ? m.split('').map(c => c + c).join('')
      : m;
    const int = parseInt(n, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
  };
  
  const rgbToHex = ([r,g,b]: [number, number, number]) =>
    '#' + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,'0')).join('');
  
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  
  const lerpColor = (hex1: string, hex2: string, t: number) => {
    const a = hexToRgb(hex1);
    const b = hexToRgb(hex2);
    return rgbToHex([lerp(a[0],b[0],t), lerp(a[1],b[1],t), lerp(a[2],b[2],t)]);
  };

  // Build an array of phase windows in minutes-from-midnight
  const windows = phases.map((p, i) => {
    const start = toMin(...p.start);
    const end   = toMin(...(phases[(i+1) % phases.length].start));
    return { ...p, start, end };
  });

  function getNowMin() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function normalizeProgress(min: number, start: number, end: number) {
    // Handle wrap at midnight for the last phase (end < start)
    let adjustedEnd = end;
    let adjustedMin = min;
    
    if (end < start) adjustedEnd += 24 * 60;
    if (min < start) adjustedMin += 24 * 60;
    
    const span = adjustedEnd - start;
    const t = Math.min(Math.max((adjustedMin - start) / span, 0), 1);
    // ease-in-out for a softer feel
    return t * t * (3 - 2 * t);
  }

  function currentWindow(min: number) {
    // find the active phase window for current time
    for (let i = 0; i < windows.length; i++) {
      const w = windows[i];
      const next = windows[(i+1) % windows.length];
      const start = w.start;
      const end   = next.start;
      
      // account for wrap
      if (start <= min && min < end) return { idx: i, start, end, w, next };
      if (start > end && (min >= start || min < end)) return { idx: i, start, end, w, next };
    }
    return { 
      idx: 0, 
      start: windows[0].start, 
      end: windows[1].start, 
      w: windows[0], 
      next: windows[1] 
    };
  }

  function blendStops(stopsA: [string, string, string], stopsB: [string, string, string], t: number): [string, string, string] {
    return [
      lerpColor(stopsA[0], stopsB[0], t),
      lerpColor(stopsA[1], stopsB[1], t),
      lerpColor(stopsA[2], stopsB[2], t)
    ];
  }

  function paint() {
    const now = getNowMin();
    const { w, start, end, next } = currentWindow(now);
    const t = normalizeProgress(now, start, end);
    const [c1, c2, c3] = blendStops(w.stops, next.stops, t);
    (el as HTMLElement).style.backgroundImage = `linear-gradient(${angle}, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
  }

  // Initial paint + timer
  paint();
  const interval = setInterval(paint, tickMs);
  
  // Return cleanup function
  return () => clearInterval(interval);
}

// Export configuration for easy tweaking
export const gradientConfig = {
  phases: [
    { name: 'Morning', start: [6, 0], description: 'warm & sunny (#FFD580 → #FFB347 → #0E1214)' },
    { name: 'Afternoon', start: [11, 0], description: 'focused brand greens (#1B5862 → #277F64 → #0E1214)' },
    { name: 'Evening', start: [17, 0], description: 'calming purples (#4B3F72 → #6B5B95 → #0E1214)' },
    { name: 'Night', start: [22, 0], description: 'deep, low-contrast (#0E1214 → #1B1F28 → #0E1214)' }
  ],
  brandColors: {
    deep: '#1B5862',
    mid: '#277F64', 
    dark: '#0E1214' // Always fades to this in bottom-right
  },
  direction: '160deg', // Top-left to bottom-right fade
  updateInterval: 30000 // 30 seconds
};