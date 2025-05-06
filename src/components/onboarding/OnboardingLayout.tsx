
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden bg-forest-green">
      {/* Background with CSS gradient instead of image */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-t from-forest-green via-lake-blue to-peach opacity-90"></div>
        
        {/* Foreground silhouette of pine trees */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3">
          <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-full">
            <path 
              d="M0,300 L0,150 L50,200 L100,120 L150,180 L200,100 L250,160 L300,80 L350,140 L400,60 L450,150 L500,90 L550,160 L600,110 L650,170 L700,100 L750,150 L800,80 L850,140 L900,90 L950,160 L1000,100 L1050,170 L1100,120 L1150,180 L1200,110 L1200,300 Z" 
              fill="#0A291D" 
              opacity="0.9"
            />
          </svg>
        </div>
      </div>
      
      {/* Floating glass orbs */}
      <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 animate-float"></div>
      <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-float-delay"></div>
      
      <div 
        className={cn(
          "w-full max-w-md md:max-w-lg z-10 p-8 backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-xl",
          className
        )}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-off-white/70 z-10">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
