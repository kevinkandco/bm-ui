import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RightDetailPanelProps {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl';
}

export const RightDetailPanel = ({ 
  open, 
  title, 
  children, 
  onClose, 
  className,
  width = 'lg'
}: RightDetailPanelProps) => {
  const widthClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[480px]',
    xl: 'w-[600px]'
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-brand-800 border-l border-border-subtle z-50 transform transition-transform duration-300 ease-in-out",
          widthClasses[width],
          open ? "translate-x-0" : "translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          {title && (
            <h2 className="text-lg font-semibold text-text-primary">
              {title}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
};