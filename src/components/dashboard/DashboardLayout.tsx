
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
}

const DashboardLayout = ({
  children,
  className,
  currentPage = "home"
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn(
    "flex-1 overflow-auto",
    className
  ), [className]);

  return (
    <div className="flex min-h-screen relative">
      {/* Main Content */}
      <div className={mainContentClasses}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
