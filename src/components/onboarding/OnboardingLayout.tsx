
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
      {/* Background with teal/coral gradient and grain texture */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-lake-blue to-hot-coral/30 opacity-70"></div>
        
        {/* Warm gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-bright-orange via-hot-coral/20 to-transparent"></div>
      </div>
      
      {/* Floating glass orbs */}
      <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-glass-blue/30 animate-float"></div>
      <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-float-delay"></div>
      
      <div 
        className={cn(
          "w-full max-w-md md:max-w-lg z-10 p-8 backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-xl",
          className
        )}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-off-white/80 z-10">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
