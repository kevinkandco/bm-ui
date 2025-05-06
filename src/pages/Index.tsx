
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-forest-green">
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
      
      {/* Glass card */}
      <div className="max-w-md w-full rounded-3xl overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 shadow-xl relative z-10">
        <div className="px-6 py-8 flex flex-col items-center">
          {/* Typography */}
          <h1 className="text-5xl font-bold text-off-white tracking-tight mb-2">Organized.</h1>
          <p className="text-2xl font-light text-off-white/50 mb-8">So you don't have to be.</p>
          
          <p className="text-base text-off-white/70 text-center mb-12">
            Brief.me is an all-in-one tool for email, communications, and updates that automatically organizes itself.
          </p>

          {/* Call to Action */}
          <Button
            asChild
            className="w-full rounded-full bg-off-white text-forest-green font-medium py-6 text-lg hover:scale-[1.03] hover:brightness-105 transition-all shadow-inner"
          >
            <Link to="/onboarding">Join the Waitlist</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
