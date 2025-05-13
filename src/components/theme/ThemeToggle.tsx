
import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full h-10 w-10 bg-surface-raised shadow-neu-raised"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-text-primary" />
      ) : (
        <Moon className="h-5 w-5 text-text-primary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
