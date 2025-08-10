import React from 'react';
import { Home, FileText, Circle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  className?: string;
}

const MobileBottomNav = ({ className }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: FileText, label: 'Briefs', path: '/briefs' },
    { icon: Circle, label: 'Status', path: '/status' },
    { icon: Settings, label: 'Settings', path: '/settings' },
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
            (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              onClick={() => navigate(item.path)}
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