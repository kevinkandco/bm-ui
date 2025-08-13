import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const appLogin = searchParams.get("appLogin");

    if (appLogin) {
      let token = localStorage.getItem("token");
      console.log(token);

      window.location.href = `electron-fiddle://auth?access_token=${token}`;
    }
  }, [searchParams]);

  const handleBack = () => {
    navigate("/");
  };

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
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-gradient-dark" : "bg-gradient-light"
          } opacity-60`}
        ></div>
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
        <Card
          className="rounded-3xl overflow-hidden border border-border-subtle glass-reflection"
          style={{
            background: "rgba(35, 35, 38, 0.75)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
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
                    filter:
                      theme === "dark"
                        ? "brightness(0) invert(1)"
                        : "brightness(0.2)",
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4 text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center px-3 py-1 rounded-full">
                <span className="text-gradient-blue font-medium text-lg sm:text-xl">
                  Welcome back
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-semibold text-text-primary tracking-tighter leading-tight">
                Brief-me App Login Successfully
              </h1>
            </div>

            <div className="space-y-4 w-full"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
