
import * as React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className={`rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle h-11 w-11 ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 transition-transform duration-200" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-200" />
      )}
    </Button>
  );
}
