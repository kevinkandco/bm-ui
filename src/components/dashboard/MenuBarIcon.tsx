
import React from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuBarIconProps {
  onClick: () => void;
  isActive?: boolean;
}

const MenuBarIcon = ({ onClick, isActive = false }: MenuBarIconProps) => {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className={`fixed top-4 right-4 w-6 h-6 p-0 rounded-full transition-all duration-150 ease-in-out z-40 ${
        isActive 
          ? "bg-accent-primary/20 text-accent-primary shadow-sm" 
          : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
      }`}
    >
      <Zap className="w-4 h-4" strokeWidth={1.5} />
    </Button>
  );
};

export default MenuBarIcon;
