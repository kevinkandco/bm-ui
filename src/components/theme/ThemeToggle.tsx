
import * as React from "react";
import { useTheme } from "@/hooks/use-theme";

// This component enforces dark theme as per the new design system
export function ThemeToggle() {
  const { setTheme } = useTheme();
  
  // Set default theme to dark on component mount and don't render any UI
  React.useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  return null;
}
