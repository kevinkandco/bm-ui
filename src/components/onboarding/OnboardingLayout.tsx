
import React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout = ({ children, className }: OnboardingLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-6 relative overflow-hidden bg-surface">
      {/* Background dotted pattern */}
      <div className="absolute inset-0 w-full h-full opacity-5 pointer-events-none">
        <div className="dotted-scale" style={{ backgroundSize: '20px 20px' }}></div>
      </div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-accent-primary/5 shadow-neu-outer"></div>
      <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-accent-primary/5 shadow-neu-outer"></div>
      
      <div 
        className={cn(
          "w-full max-w-md z-10 p-6 sm:p-8 rounded-xl bg-surface-raised shadow-neu-raised",
          className
        )}
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
