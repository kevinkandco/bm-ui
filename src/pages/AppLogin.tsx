
import React, { useEffect, useState, } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { REDIRECT_URL } from "@/config";

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [isElectron, setIsElectron] = useState(false);

  const appLogin = searchParams.get('appLogin');

  const handleSignIn = () => {
    try {
      const url = `${REDIRECT_URL}/google/auth?appLogin=${appLogin}`;
      window.open(url, "_self");
    } catch (error) {
      console.log(error);
    }
  };

useEffect(() => {
  const token = searchParams.get("token");
  
  setIsElectron(window?.electronAPI?.isElectron)
  console.log(window?.electronAPI?.isElectron);
  if (token) {
    console.log("Received token", token);
    
    if (window.electronAPI) {
      // Electron environment
      window.electronAPI.setToken(token)
        .then(() => {
          console.log("Token stored in Electron");
          window.electronAPI.redirectToDashboard();
        })
        .catch(err => {
          console.error("Failed to store token:", err);
        });
    }
  }
}, [searchParams]);

  const handleBack = () => {
    navigate("/");
  };

  const handleLunchApp = () => {
    let token = localStorage.getItem("token");
    console.log(token);
    
     window.location.href = `briefme://auth?token=${token}`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-surface">
      {/* Background with image overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/lovable-uploads/8ea55fb5-fb6e-49d0-881c-5d96263e886d.png" 
            alt="Dashboard background" 
            className="w-full h-full object-cover filter blur"
            loading="eager"
          />
        </div>
        <div className={`absolute inset-0 ${theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"} opacity-60`}></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-texture"></div>
      </div>
      
      {/* Back button */}
      <div className="absolute top-4 left-4 z-20">
        <Button 
          variant="back" 
          onClick={handleBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      
      {/* Glass card */}
      <div className="w-full max-w-md mx-auto z-10">
        <Card className="rounded-3xl overflow-hidden border border-border-subtle glass-reflection" style={{
          background: 'rgba(35, 35, 38, 0.75)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <CardContent className="px-4 py-6 sm:px-6 sm:py-8 flex flex-col items-center text-center">
            {/* Glow orb visual element */}
            <div className="h-28 sm:h-40 w-full flex items-center justify-center relative mb-4 sm:mb-8">
              <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-accent-primary/5 animate-pulse absolute"></div>
              <div className="w-18 sm:w-24 h-18 sm:h-24 rounded-full bg-accent-primary/10 animate-glow absolute"></div>
              <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-accent-primary/15 absolute flex items-center justify-center">
                <img 
                  src="/lovable-uploads/432a0bc4-376f-4766-864d-ff5f206b8068.png" 
                  alt="Sound wave" 
                  className="w-8 sm:w-10 h-8 sm:h-10 opacity-90 wave-pulse" 
                  style={{
                    filter: theme === 'dark' ? "brightness(0) invert(1)" : "brightness(0.2)"
                  }} 
                />
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full">
                <span className="text-gradient-blue font-medium text-lg sm:text-xl">Welcome back</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-semibold text-text-primary tracking-tighter leading-tight">
                Sign in to Brief-me App
              </h1>
              <p className="text-text-secondary max-w-sm mx-auto text-sm sm:text-base">
                Access your personalized briefings and stay informed.
              </p>
            </div>
            
            <div className="space-y-4 w-full">
              <Button 
                className="w-full bg-surface-overlay hover:bg-surface-raised text-text-primary border border-border-subtle shadow-subtle flex items-center justify-center gap-2 sm:gap-3 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-400" 
                onClick={() => handleSignIn('google')} 
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </Button>

            <Button 
            onClick={() => handleLunchApp()} 
                className="w-full bg-surface-overlay hover:bg-surface-raised text-text-primary border border-border-subtle shadow-subtle flex items-center justify-center gap-2 sm:gap-3 rounded-xl py-2.5 sm:py-3 text-sm sm:text-base transition-all duration-400" 
                 >
                Lunch App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
