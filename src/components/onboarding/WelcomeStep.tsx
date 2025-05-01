
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = (provider: 'google' | 'slack') => {
    setSigningIn(true);
    // Simulate authentication
    setTimeout(() => {
      setSigningIn(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={1} totalSteps={3} />
      
      <div className="space-y-2 text-center">
        <div className="inline-flex items-center justify-center bg-gradient-primary text-white px-3 py-1 rounded-full text-xs">
          Welcome to Brief.me
        </div>
        <h1 className="text-3xl font-bold text-foreground">Stay in sync. Skip the scroll.</h1>
        <p className="text-neutral-gray">Get caught up on what matters most to you in less than 3 minutes a day.</p>
      </div>
      
      <div className="space-y-3 pt-4">
        <Button 
          className="w-full bg-white hover:bg-white/90 text-foreground border shadow-sm flex items-center justify-center gap-2"
          onClick={() => handleSignIn('google')}
          disabled={signingIn}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path 
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path 
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path 
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path 
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>
        
        <Button 
          className="w-full bg-indigo hover:bg-indigo/90 text-white flex items-center justify-center gap-2"
          onClick={() => handleSignIn('slack')}
          disabled={signingIn}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path 
              d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"
              fill="currentColor"
            />
          </svg>
          Sign in with Slack
        </Button>
      </div>
    </div>
  );
};

export default WelcomeStep;
