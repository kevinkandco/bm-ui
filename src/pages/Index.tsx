
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Index = () => {
  const { theme } = useTheme();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Light mode background */}
      <div className="radial-gradient-bg" />
      
      <div className="max-w-2xl text-center space-y-8 z-10">
        <h1 className="text-5xl font-bold">
          Brief.me — Stay in sync. Skip the scroll.
        </h1>
        <p className="text-xl mx-auto">
          Get caught up on what matters most to you in less than 3 minutes a day.
          Try our delightful onboarding experience below.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            className="neon-button px-8 py-6 text-lg"
          >
            <Link to="/onboarding">Try Brief.me</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
