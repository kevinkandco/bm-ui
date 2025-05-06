
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
  const styleCSS = `
    @keyframes pulse55bpm {
      0% { transform: scale(0.96); opacity: 0.85; }
      50% { transform: scale(1.04); opacity: 1; }
      100% { transform: scale(0.96); opacity: 0.85; }
    }
    .wave-pulse {
      animation: pulse55bpm 1.091s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* 55bpm = 1.091s per beat */
    }
    
    /* Schedule card styles */
    .schedule-card {
      transition: all 0.2s ease-out;
    }
    .schedule-card:hover {
      transform: translateY(-2px);
    }
    .schedule-card.selected {
      border-color: var(--electric-teal);
      background-color: rgba(0, 200, 200, 0.1);
    }
    
    /* Glowing shadow effect for selected cards */
    .shadow-glow {
      box-shadow: 0 0 15px rgba(0, 200, 200, 0.3);
    }
    
    /* Custom preference chip styles */
    .preference-chip {
      padding: 0.5rem 0.75rem;
      border-radius: 9999px;
      background-color: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .preference-chip:hover {
      background-color: rgba(30, 41, 59, 0.7);
    }
    .preference-chip.selected {
      background-color: rgba(0, 200, 200, 0.15);
      border-color: rgba(0, 200, 200, 0.4);
    }
    
    /* Custom delivery card styles */
    .delivery-card {
      padding: 1rem;
      border-radius: 0.75rem;
      background-color: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(148, 163, 184, 0.2);
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .delivery-card:hover {
      background-color: rgba(30, 41, 59, 0.7);
    }
    .delivery-card.selected {
      background-color: rgba(0, 200, 200, 0.15);
      border-color: rgba(0, 200, 200, 0.4);
    }
  `;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden bg-deep-teal">
      <style>{styleCSS}</style>
      
      {/* Background with enhanced teal gradient */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-lake-blue/70 to-hot-coral/20 opacity-80"></div>
        
        {/* TV noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
        
        {/* Warm gradient overlay at bottom - increased contrast */}
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-bright-orange/40 to-transparent"></div>
      </div>
      
      {/* Fluid Aurora Ribbon Effect */}
      <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
        <div className="aurora-ribbon"></div>
      </div>
      
      {/* Floating glass orbs with enhanced visibility - reduced size on mobile */}
      <div className={`absolute left-1/4 top-1/3 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full backdrop-blur-md border border-white/20 animate-float z-[2] glass-reflection`} style={{background: 'rgba(69, 175, 201, 0.2)'}}></div>
      <div className={`absolute right-1/4 bottom-1/3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full backdrop-blur-md border border-white/20 animate-float-delay z-[2] glass-reflection`} style={{background: 'rgba(69, 175, 201, 0.15)'}}></div>
      
      <div 
        className={cn(
          "w-full max-w-md z-10 p-6 sm:p-8 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg glass-reflection",
          className
        )}
        style={{
          background: 'rgba(69, 175, 201, 0.25)', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
        }}
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
