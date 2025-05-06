
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout = ({ children, className }: OnboardingLayoutProps) => {
  const isMobile = useIsMobile();
  
  // Add mouse parallax effect for background (desktop only)
  useEffect(() => {
    // Skip parallax on mobile for better performance
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const shapes = document.querySelectorAll('.neon-shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.forEach((shape: Element) => {
        const shapeElement = shape as HTMLElement;
        const speed = parseFloat(shapeElement.getAttribute('data-speed') || '1');
        const xOffset = (x - 0.5) * 20 * speed;
        const yOffset = (y - 0.5) * 20 * speed;
        
        shapeElement.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  // Add CSS for the wave icon pulse animation at 55bpm
  const pulseAnimationCSS = `
    @keyframes pulse55bpm {
      0% { transform: scale(0.96); opacity: 0.85; }
      50% { transform: scale(1.04); opacity: 1; }
      100% { transform: scale(0.96); opacity: 0.85; }
    }
    .wave-pulse {
      animation: pulse55bpm 1.091s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* 55bpm = 1.091s per beat */
    }
  `;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden bg-deep-teal">
      <style>{pulseAnimationCSS}</style>
      
      {/* Background with teal/coral gradient and grain texture - enhanced contrast */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-lake-blue/70 to-hot-coral/40 opacity-80"></div>
        
        {/* TV noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
        
        {/* Warm gradient overlay at bottom - increased contrast */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-bright-orange/80 via-hot-coral/30 to-transparent"></div>
      </div>
      
      {/* Fluid Aurora Ribbon Effect */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="aurora-ribbon"></div>
      </div>
      
      {/* Floating glass orbs with enhanced visibility - reduced size on mobile */}
      <div className={`absolute left-1/4 top-1/3 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full bg-white/20 backdrop-blur-md border border-glass-blue/40 animate-float shadow-neon z-[2]`}></div>
      <div className={`absolute right-1/4 bottom-1/3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full bg-white/15 backdrop-blur-md border border-white/20 animate-float-delay shadow-subtle z-[2]`}></div>
      
      <div 
        className={cn(
          "w-full max-w-md z-10 p-6 sm:p-8 backdrop-blur-xl bg-white/15 rounded-3xl border border-white/30 shadow-xl",
          className
        )}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-white/90 z-10 px-4 text-center">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
