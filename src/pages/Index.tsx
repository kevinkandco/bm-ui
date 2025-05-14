import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  // Memoize the CSS string to prevent unnecessary re-creation on re-renders
  const pulseAnimationCSS = useMemo(() => `
    @keyframes pulse55bpm {
      0% { transform: scale(0.96); opacity: 0.85; }
      50% { transform: scale(1.04); opacity: 1; }
      100% { transform: scale(0.96); opacity: 0.85; }
    }
    .wave-pulse {
      animation: pulse55bpm 1.091s cubic-bezier(0.4, 0, 0.6, 1) infinite; /* 55bpm = 1.091s per beat */
    }
  `, []);
  
  return <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-surface">
      <style>{pulseAnimationCSS}</style>
      
      {/* Background with image overlay */}
      <div className="absolute inset-0 w-full h-full">
        {/* Background image - slightly increased blur */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/lovable-uploads/8ea55fb5-fb6e-49d0-881c-5d96263e886d.png" 
            alt="Dashboard background" 
            className="w-full h-full object-cover filter blur"
            loading="eager"
          />
        </div>
        
        {/* Color overlay with reduced opacity */}
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"} opacity-60`}></div>
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
      </div>
      
      {/* Glow shapes */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-40"></div>
      <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-accent-secondary/5 filter blur-3xl opacity-30"></div>
      <div className="absolute -bottom-40 left-1/4 w-80 h-80 rounded-full bg-accent-primary/5 filter blur-3xl opacity-30"></div>
      
      {/* Floating glass panels - smaller on mobile */}
      <div className={`absolute left-1/4 top-1/3 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-xl glass-reflection z-[2] opacity-20`} style={{
      background: 'rgba(43, 136, 255, 0.05)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}></div>
      <div className={`absolute right-1/4 bottom-1/3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-xl glass-reflection animate-float-delay z-[2] opacity-20`} style={{
      background: 'rgba(43, 136, 255, 0.03)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.05)'
    }}></div>
      
      {/* Glass card */}
      <div className="w-full max-w-md mx-auto z-10">
        <Card className="rounded-3xl overflow-hidden border border-border-subtle glass-reflection" style={{
        background: 'rgba(35, 35, 38, 0.75)',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
          <CardContent className="px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
            {/* Neon orb visual element */}
            <div className="h-32 sm:h-40 w-full flex items-center justify-center relative mb-6 sm:mb-8">
              <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-accent-primary/10 animate-pulse absolute"></div>
              <div className="w-18 sm:w-24 h-18 sm:h-24 rounded-full bg-accent-primary/15 animate-glow absolute"></div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-accent-primary/20 absolute flex items-center justify-center">
                <img src="/lovable-uploads/432a0bc4-376f-4766-864d-ff5f206b8068.png" alt="Sound wave" className="w-8 sm:w-10 h-8 sm:h-10 opacity-90 wave-pulse" loading="eager" style={{
                filter: "brightness(0) invert(1)"
              }} />
              </div>
            </div>
            
            {/* Typography */}
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs mb-2">
              <span className="text-gradient-blue font-medium text-lg sm:text-xl">Brief-me</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-semibold text-text-primary tracking-tighter mb-2 leading-tight">
              Stay informed, not overwhelmed.
            </h1>
            
            <p className="text-text-secondary mb-6 sm:mb-8 mx-auto text-sm sm:text-base">Brief-me delivers personalized summaries of what matters most. Get caught up in minutes, not hours.</p>

            {/* Call to Action */}
            <Button asChild className="w-full rounded-full bg-accent-primary text-text-primary font-medium py-5 sm:py-6 text-base sm:text-lg hover:scale-[1.03] hover:brightness-105 transition-all">
              <Link to="/onboarding">Join the Waitlist</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default React.memo(Index);
