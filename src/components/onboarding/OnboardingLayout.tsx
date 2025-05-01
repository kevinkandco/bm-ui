
import React from "react";
import { cn } from "@/lib/utils";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const OnboardingLayout = ({ children, className }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-soft-gray to-white flex flex-col items-center justify-center p-4">
      <div 
        className={cn(
          "w-full max-w-md md:max-w-lg glass-card p-8 animate-fade-in",
          className
        )}
      >
        {children}
      </div>
      <div className="mt-4 text-xs text-neutral-gray">
        You control what Brief.me monitors. Change anytime.
      </div>
    </div>
  );
};

export default OnboardingLayout;
