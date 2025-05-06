
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-deep-teal">
      {/* Background with warm gradient and grain texture */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-t from-deep-teal via-lake-blue/70 to-hot-coral/40 opacity-80"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-bright-orange/80 via-hot-coral/30 to-transparent"></div>
      </div>
      
      {/* Floating glass orbs */}
      <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-glass-blue/40 animate-float shadow-neon"></div>
      <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 animate-float-delay shadow-subtle"></div>
      
      {/* Glass card */}
      <Card className="max-w-md w-full rounded-3xl overflow-hidden backdrop-blur-md bg-white/15 border border-white/30 shadow-xl relative z-10">
        <CardContent className="px-6 py-8 flex flex-col items-center text-center">
          {/* Neon orb visual element */}
          <div className="h-40 w-full flex items-center justify-center relative mb-8">
            <div className="w-32 h-32 rounded-full bg-[#49a5ac20] animate-pulse absolute"></div>
            <div className="w-24 h-24 rounded-full bg-[#49a5ac30] animate-glow absolute"></div>
            <div className="w-16 h-16 rounded-full bg-[#49a5ac45] absolute flex items-center justify-center">
              <img 
                src="/lovable-uploads/432a0bc4-376f-4766-864d-ff5f206b8068.png" 
                alt="Sound wave" 
                className="w-10 h-10 opacity-90"
                loading="eager"
              />
            </div>
          </div>
          
          {/* Typography */}
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs mb-2">
            <span className="text-gradient-neon font-medium text-xl">Brief.me</span>
          </div>
          
          <h1 className="text-4xl font-semibold text-off-white tracking-tighter mb-2 text-center">
            Stay informed, not overwhelmed.
          </h1>
          
          <p className="text-off-white/90 text-center mb-8 mx-auto">
            Brief.me delivers personalized summaries of what matters most. Get caught up in minutes, not hours.
          </p>

          {/* Call to Action */}
          <Button
            asChild
            className="w-full rounded-full bg-neon-mint text-forest-green font-medium py-6 text-lg hover:scale-[1.03] hover:brightness-105 transition-all"
          >
            <Link to="/onboarding">Join the Waitlist</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(Index);
