import React from 'react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader = ({ className }: MobileHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-center px-6 pt-16 pb-6", className)}>
      <img 
        src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" 
        alt="Brief Me" 
        className="h-8 w-auto" 
      />
    </div>
  );
};

export default MobileHeader;