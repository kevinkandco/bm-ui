import React from 'react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader = ({ className }: MobileHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-start px-6 pt-16 pb-6", className)}>
      <img 
        src="/lovable-uploads/ca0ff646-c092-4c83-bfc5-b7c249e0f8d5.png" 
        alt="Brief Me" 
        className="h-8 w-auto" 
      />
    </div>
  );
};

export default MobileHeader;