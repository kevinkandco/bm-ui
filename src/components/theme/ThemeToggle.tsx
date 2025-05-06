
import * as React from "react";
import { useTheme } from "@/hooks/use-theme";

// This component is intentionally empty as per user request to remove the theme toggle button
export function ThemeToggle() {
  const { setTheme } = useTheme();
  
  // Set default theme to dark and don't render any UI
  React.useEffect(() => {
    setTheme("dark");
  }, [setTheme]);
  
  return null;
}
