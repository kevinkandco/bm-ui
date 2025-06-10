
import React, { useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/hooks/use-theme";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout = ({
  children,
  className
}: OnboardingLayoutProps) => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

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

  const gradientClassName = useMemo(() => 
    theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light",
    [theme]
  );

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 pb-6 pt-0 relative overflow-hidden bg-surface">
      {/* Background with new image */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background image with blur */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/lovable-uploads/108ead20-e97f-4d4b-b521-533474e0989c.png" 
            alt="Dashboard background" 
            className="w-full h-full object-cover"
            style={{ filter: 'blur(0.8px)' }}
            loading="eager"
          />
        </div>
        
        {/* Color overlay */}
        <div className={`absolute inset-0 ${gradientClassName} opacity-80`}></div>
        
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-surface-raised/10 to-transparent opacity-30"></div>
      </div>
      
      {/* Glow shapes - Subtle background elements */}
      <div className="glow-shape absolute top-0 -left-20 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-20" data-speed="0.5"></div>
      <div className="glow-shape absolute top-1/5 -right-20 w-96 h-96 rounded-full bg-accent-secondary/5 filter blur-3xl opacity-15" data-speed="0.8"></div>
      
      <div className={cn("w-full max-w-md z-10 p-6 sm:p-8 mt-0 rounded-xl glass-card", className)}>
        {children}
      </div>
      
      <div className="mt-3 text-xs text-text-secondary z-10 px-4 text-center font-medium">You control what Brief-me monitors. Change anytime.</div>
    </div>
  );
};

export default React.memo(OnboardingLayout);
