import React from 'react';
import { ChevronDown, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export type StatusType = 'active' | 'away' | 'focus' | 'vacation' | 'offline';

export interface StatusMenuProps {
  value: StatusType;
  onChange: (status: StatusType) => void;
  className?: string;
}

export const StatusMenu = ({ value, onChange, className }: StatusMenuProps) => {
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'away': return 'text-yellow-500';
      case 'focus': return 'text-blue-500';
      case 'vacation': return 'text-gray-500';
      case 'offline': return 'text-red-500';
      default: return 'text-green-500';
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case 'active': return 'Active';
      case 'away': return 'Away from keyboard';
      case 'focus': return 'Focus';
      case 'vacation': return 'Vacation';
      case 'offline': return 'Offline';
      default: return 'Active';
    }
  };

  const statusOptions: { value: StatusType; label: string }[] = [
    { value: 'active', label: 'Active' },
    { value: 'away', label: 'Away from keyboard' },
    { value: 'focus', label: 'Focus' },
    { value: 'vacation', label: 'Vacation' },
    { value: 'offline', label: 'Offline' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 px-3 py-2 h-auto text-left justify-start",
            className
          )}
        >
          <Circle className={cn("h-2 w-2 fill-current", getStatusColor(value))} />
          <span className="text-sm text-text-secondary">
            {getStatusLabel(value)}
          </span>
          <ChevronDown className="h-3 w-3 text-text-muted ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="start" 
        className="w-48 bg-brand-700 border-border-subtle"
      >
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary hover:bg-brand-600"
          >
            <Circle 
              className={cn("h-2 w-2 fill-current", getStatusColor(option.value))} 
            />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};