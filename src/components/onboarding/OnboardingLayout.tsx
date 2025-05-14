
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 pb-6 pt-0 relative overflow-hidden bg-surface">
      {/* Background with gradient */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-dark opacity-80"></div>
        
        {/* Subtle radial gradient for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-surface-raised/10 to-transparent opacity-30"></div>
      </div>
      
      {/* Glow shapes - Subtle background elements */}
      <div className="glow-shape absolute top-0 -left-20 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-20" data-speed="0.5"></div>
      <div className="glow-shape absolute top-1/5 -right-20 w-96 h-96 rounded-full bg-accent-secondary/5 filter blur-3xl opacity-15" data-speed="0.8"></div>
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      <div 
        className={cn("w-full max-w-md z-10 p-6 sm:p-8 mt-0 rounded-xl glass-card", className)} 
        style={{
          background: theme === 'dark' 
            ? 'linear-gradient(180deg, rgba(35, 35, 38, 0.75) 0%, rgba(26, 26, 28, 0.9) 100%)'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(245, 245, 247, 0.95) 100%)',
          boxShadow: theme === 'dark'
            ? '0 4px 20px rgba(0, 0, 0, 0.25)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        {children}
      </div>
      
      <div className="mt-3 text-xs text-text-secondary z-10 px-4 text-center">You control what Brief-me monitors. Change anytime.</div>
    </div>
  );
};

export default OnboardingLayout;
