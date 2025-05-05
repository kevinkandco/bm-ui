
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
    <div className="min-h-screen w-full bg-canvas-black text-ice-grey flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="radial-gradient-bg" />
      
      {/* Neon shapes */}
      <div className="neon-shape w-64 h-64 rounded-full bg-deep-plum/30 top-1/4 -left-20" data-speed="0.5" />
      <div className="neon-shape w-80 h-80 rounded-full bg-cranberry/20 bottom-0 right-0" data-speed="0.7" />
      <div className="neon-shape w-40 h-40 rounded-full bg-electric-teal/10 top-10 right-20 animate-float" data-speed="1.2" />
      
      <div 
        className={cn(
          "w-full max-w-md md:max-w-lg z-10 p-8 animate-fade-in rounded-xl border border-cool-slate/10 bg-canvas-black/60 backdrop-blur-md shadow-neo",
          className
        )}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-cool-slate z-10">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
