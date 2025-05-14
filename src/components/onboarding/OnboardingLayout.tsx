
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
      const shapes = document.querySelectorAll('.glow-shape');
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.forEach((shape: Element) => {
        const shapeElement = shape as HTMLElement;
        const speed = parseFloat(shapeElement.getAttribute('data-speed') || '1');
        const xOffset = (x - 0.5) * 30 * speed;
        const yOffset = (y - 0.5) * 30 * speed;
        
        shapeElement.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 pb-6 pt-2 relative overflow-hidden bg-surface">
      {/* Background with dark gradient */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-dark opacity-80"></div>
        
        {/* Removed the horizontal glow line */}
        
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-surface-raised/20 to-transparent opacity-50"></div>
      </div>
      
      {/* Glow shapes */}
      <div className="glow-shape absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-40" data-speed="0.5"></div>
      <div className="glow-shape absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-accent-secondary/5 filter blur-3xl opacity-30" data-speed="0.8"></div>
      <div className="glow-shape absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-30" data-speed="0.6"></div>
      
      {/* Floating glass panels - reduced size on mobile */}
      <div 
        className={`absolute left-1/4 top-1/3 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-xl glass-reflection z-[2] opacity-20`}
        style={{
          background: 'rgba(43, 136, 255, 0.05)', 
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      ></div>
      <div 
        className={`absolute right-1/4 bottom-1/3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-xl glass-reflection animate-float-delay z-[2]`}
        style={{
          background: 'rgba(43, 136, 255, 0.03)', 
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      ></div>
      
      <div 
        className={cn(
          "w-full max-w-md z-10 p-6 sm:p-8 backdrop-blur-xl rounded-3xl border border-border-subtle glass-reflection",
          className
        )}
        style={{
          background: 'rgba(35, 35, 38, 0.75)', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}
      >
        {children}
      </div>
      
      <div className="mt-4 text-xs text-text-secondary z-10 px-4 text-center">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
