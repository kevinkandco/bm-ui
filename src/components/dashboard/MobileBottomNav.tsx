import React from 'react';
import { Home, FileText, Target, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  className?: string;
  onShowFocusModal?: () => void;
}

const MobileBottomNav = ({ className, onShowFocusModal }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard', onClick: () => navigate('/dashboard') },
    { icon: FileText, label: 'Briefs', path: '/briefs', onClick: () => navigate('/briefs') },
    { icon: Target, label: 'Focus', path: '/focus', onClick: () => onShowFocusModal?.() },
    { icon: Settings, label: 'Settings', path: '/settings', onClick: () => navigate('/settings') },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-20 bg-surface/95 backdrop-blur-sm border-t border-border-subtle z-40",
      className
    )}>
      <div className="flex items-center justify-around h-full px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/dashboard' && location.pathname === '/') ||
            (item.label === 'Focus' && location.pathname === '/status');
          
          return (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className={cn(
                "flex flex-col items-center gap-1 h-full py-2 px-3 hover:bg-surface-raised/50 rounded-lg",
                isActive && "text-accent-primary"
              )}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive && "text-accent-primary"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-accent-primary" : "text-text-secondary"
              )}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;