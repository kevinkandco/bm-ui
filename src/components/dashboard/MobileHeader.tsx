import React from 'react';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
}

const MobileHeader = ({ className }: MobileHeaderProps) => {
  return (
    <div className={cn("flex items-center justify-start px-6 pt-16 pb-6", className)}>
      <img 
        src="/lovable-uploads/36831760-0deb-4010-9a3b-973f1f8decc3.png" 
        alt="Brief Me" 
        className="h-8 w-auto" 
      />
    </div>
  );
};

export default MobileHeader;