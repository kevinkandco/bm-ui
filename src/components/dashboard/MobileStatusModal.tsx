import React from 'react';
import { Wifi, Target, Plane, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStatus: (status: 'online' | 'focus' | 'vacation' | 'offline') => void;
  currentStatus?: string;
}

const MobileStatusModal = ({ isOpen, onClose, onSelectStatus, currentStatus = 'online' }: MobileStatusModalProps) => {
  if (!isOpen) return null;

  const statusOptions = [
    {
      id: 'online' as const,
      label: 'Online',
      icon: Wifi,
      color: 'bg-emerald-500',
      description: 'Available for all notifications'
    },
    {
      id: 'focus' as const,
      label: 'Focus Mode',
      icon: Target,
      color: 'bg-accent-primary',
      description: 'Limited notifications only'
    },
    {
      id: 'vacation' as const,
      label: 'Vacation Mode',
      icon: Plane,
      color: 'bg-orange-500',
      description: 'Away on vacation'
    },
    {
      id: 'offline' as const,
      label: 'Offline',
      icon: WifiOff,
      color: 'bg-gray-500',
      description: 'Not receiving notifications'
    }
  ];

  const handleStatusSelect = (status: 'online' | 'focus' | 'vacation' | 'offline') => {
    onSelectStatus(status);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-surface/95 backdrop-blur-sm z-50 flex flex-col">
      <div className="flex-1 px-6 pt-16">
        <h1 className="text-2xl font-bold text-text-primary mb-8">
          Set Status
        </h1>
        
        <div className="space-y-4">
          {statusOptions.map((status) => {
            const Icon = status.icon;
            const isActive = currentStatus === status.id;
            
            return (
              <Button
                key={status.id}
                onClick={() => handleStatusSelect(status.id)}
                variant="ghost"
                className={cn(
                  "w-full h-auto p-6 bg-surface-raised/50 hover:bg-surface-raised/80 rounded-xl border border-border-subtle",
                  "flex items-center gap-4 justify-start text-left transition-all",
                  isActive && "border-accent-primary/50 bg-accent-primary/10"
                )}
              >
                <div className={cn(
                  "w-4 h-4 rounded-full flex-shrink-0",
                  status.color
                )} />
                <div className="flex-1 min-w-0">
                  <div className="text-text-primary font-medium text-lg">
                    {status.label}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {status.description}
                  </div>
                </div>
                <Icon className="w-5 h-5 text-text-secondary" />
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom padding to avoid overlap with nav */}
      <div className="h-24" />
    </div>
  );
};

export default MobileStatusModal;