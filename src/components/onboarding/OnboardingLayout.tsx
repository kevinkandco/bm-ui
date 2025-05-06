
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout = ({ children, className }: OnboardingLayoutProps) => {
  // Add mouse parallax effect for background
  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-deep-teal">
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
      
      {/* Floating glass orbs with enhanced visibility */}
      <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-glass-blue/40 animate-float shadow-neon z-[2]"></div>
      <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 animate-float-delay shadow-subtle z-[2]"></div>
      
      <div 
        className={cn(
          "w-full max-w-md md:max-w-lg z-10 p-8 backdrop-blur-xl bg-white/15 rounded-3xl border border-white/30 shadow-xl",
          className
        )}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-white/90 z-10">
        You control what Brief.me monitors. Change anytime.
      </div>

      {/* Custom breathing pulse effect for the sound wave icon */}
      <style>
        {`
        @keyframes smoothPulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }
        
        .pulse-55bpm {
          animation: smoothPulse 1.09s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        `}
      </style>
    </div>
  );
};

export default OnboardingLayout;
