import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuickChip {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'accent' | 'outline';
}

export interface QuickChipsProps {
  chips: QuickChip[];
  onClick: (chip: QuickChip) => void;
  className?: string;
}

export const QuickChips = ({ chips, onClick, className }: QuickChipsProps) => {
  return (
    <div className={cn("flex flex-wrap gap-2 p-4 mt-auto mb-20", className)}>
      {chips.map((chip) => {
        const Icon = chip.icon;
        
        return (
          <Button
            key={chip.id}
            variant={chip.variant === 'accent' ? 'default' : chip.variant || 'outline'}
            size="sm"
            onClick={() => onClick(chip)}
            className={cn(
              "h-8 px-3 rounded-full text-xs",
              chip.variant === 'accent' && "bg-brand-300 text-brand-900 hover:bg-brand-200"
            )}
          >
            {Icon && <Icon className="h-3 w-3 mr-1" />}
            {chip.label}
          </Button>
        );
      })}
    </div>
  );
};