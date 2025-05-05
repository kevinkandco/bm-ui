
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  
  // If mobile, use system theme and don't show toggle
  React.useEffect(() => {
    if (isMobile) {
      setTheme("system");
    }
  }, [isMobile, setTheme]);
  
  // Don't render anything on mobile
  if (isMobile) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
