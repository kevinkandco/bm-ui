
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-surface-tint">
      {/* Background with warm gradient and grain texture */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-t from-surface-tint via-accent-primary/20 to-neutral-light opacity-90"></div>
        
        {/* Warm gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-dark-emphasis/10 via-accent-primary/10 to-transparent"></div>
      </div>
      
      {/* Floating glass orbs */}
      <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-surface-tint/20 backdrop-blur-md border border-neutral-light/30 animate-float"></div>
      <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-surface-tint/10 backdrop-blur-md border border-neutral-light/20 animate-float-delay"></div>
      
      {/* Glass card */}
      <div className="max-w-md w-full rounded-3xl overflow-hidden backdrop-blur-md bg-surface-tint/20 border border-neutral-light/30 shadow-xl relative z-10">
        <div className="px-6 py-8 flex flex-col items-center">
          {/* Typography */}
          <h1 className="text-5xl font-bold text-dark-emphasis tracking-tight mb-2">Organized.</h1>
          <p className="text-2xl font-light text-dark-emphasis/80 mb-8">So you don't have to be.</p>
          
          <p className="text-base text-dark-emphasis/90 text-center mb-12">
            Brief.me is an all-in-one tool for email, communications, and updates that automatically organizes itself.
          </p>

          {/* Call to Action */}
          <Button
            asChild
            className="w-full rounded-full bg-accent-primary text-surface-tint font-medium py-6 text-lg hover:bg-accent-primary-hover hover:scale-[1.03] transition-all shadow-inner"
          >
            <Link to="/onboarding">Join the Waitlist</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
