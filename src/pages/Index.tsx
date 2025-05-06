
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
    
    /* Glass reflection effect */
    .glass-reflection {
      position: relative;
      overflow: hidden;
    }
    
    .glass-reflection::before {
      content: '';
      position: absolute;
      top: 0;
      left: -50%;
      width: 200%;
      height: 100%;
      background: linear-gradient(
        to right,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.1) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      transform: rotate(-25deg);
      pointer-events: none;
    }
  `, []);
  
  // Memoize the floating orb properties based on mobile state
  const floatingOrbsProps = useMemo(() => ({
    firstOrb: {
      className: `absolute left-1/4 top-1/3 ${isMobile ? 'w-16 h-16' : 'w-24 h-24'} rounded-full border border-white/20 animate-float glass-reflection`,
      style: {
        background: 'rgba(69, 175, 201, 0.25)', 
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
      }
    },
    secondOrb: {
      className: `absolute right-1/4 bottom-1/3 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} rounded-full border border-white/20 animate-float-delay glass-reflection`,
      style: {
        background: 'rgba(69, 175, 201, 0.15)', 
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
      }
    }
  }), [isMobile]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-deep-teal">
      <style>{pulseAnimationCSS}</style>
      
      {/* Background with enhanced teal gradient */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-lake-blue/70 to-hot-coral/20 opacity-80"></div>
        
        {/* TV noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-bright-orange/40 to-transparent"></div>
      </div>
      
      {/* Floating glass orbs - smaller on mobile */}
      <div {...floatingOrbsProps.firstOrb}></div>
      <div {...floatingOrbsProps.secondOrb}></div>
      
      {/* Glass card */}
      <div className="w-full max-w-md mx-auto z-10">
        <Card className="rounded-3xl overflow-hidden border border-white/20 glass-reflection"
              style={{
                background: 'rgba(69, 175, 201, 0.25)', 
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
              }}>
          <CardContent className="px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
            {/* Neon orb visual element */}
            <div className="h-32 sm:h-40 w-full flex items-center justify-center relative mb-6 sm:mb-8">
              <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[#49a5ac20] animate-pulse absolute"></div>
              <div className="w-18 sm:w-24 h-18 sm:h-24 rounded-full bg-[#49a5ac30] animate-glow absolute"></div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-[#49a5ac45] absolute flex items-center justify-center">
                <img 
                  src="/lovable-uploads/432a0bc4-376f-4766-864d-ff5f206b8068.png" 
                  alt="Sound wave" 
                  className="w-8 sm:w-10 h-8 sm:h-10 opacity-90 wave-pulse"
                  loading="eager"
                  style={{ background: 'transparent' }}
                />
              </div>
            </div>
            
            {/* Typography */}
            <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs mb-2">
              <span className="text-gradient-neon font-medium text-lg sm:text-xl">Brief.me</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-semibold text-off-white tracking-tighter mb-2 leading-tight">
              Stay informed, not overwhelmed.
            </h1>
            
            <p className="text-off-white/90 mb-6 sm:mb-8 mx-auto text-sm sm:text-base">
              Brief.me delivers personalized summaries of what matters most. Get caught up in minutes, not hours.
            </p>

            {/* Call to Action */}
            <Button
              asChild
              className="w-full rounded-full bg-neon-mint text-forest-green font-medium py-5 sm:py-6 text-base sm:text-lg hover:scale-[1.03] hover:brightness-105 transition-all"
            >
              <Link to="/onboarding">Join the Waitlist</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default React.memo(Index);
