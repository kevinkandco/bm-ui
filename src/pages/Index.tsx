
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-gray to-white px-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold text-foreground">
          Brief.me — Stay in sync. Skip the scroll.
        </h1>
        <p className="text-xl text-neutral-gray">
          Get caught up on what matters most to you in less than 3 minutes a day.
          Try our delightful onboarding experience below.
        </p>
        <div className="flex justify-center">
          <Button
            asChild
            className="bg-indigo hover:bg-indigo/90 text-white px-8 py-6 text-lg rounded-xl"
          >
            <Link to="/onboarding">Try Brief.me</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
