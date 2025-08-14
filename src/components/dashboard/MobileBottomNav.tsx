import React from 'react';
import { Home, FileText, CheckSquare, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
  className?: string;
  onShowStatusModal?: () => void;
  userStatus?: 'active' | 'away' | 'focus' | 'vacation' | 'offline';
}

const MobileBottomNav = ({ className, onShowStatusModal, userStatus = 'active' }: MobileBottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getUserStatusDotColor = (status: 'active' | 'away' | 'focus' | 'vacation' | 'offline') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'focus':
        return 'bg-blue-500';
      case 'vacation':
        return 'bg-gray-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/dashboard', onClick: () => navigate('/dashboard') },
    { icon: FileText, label: 'Briefs', path: '/dashboard/briefs', onClick: () => navigate('/dashboard/briefs') },
    { icon: User, label: 'Status', path: '/status', onClick: () => onShowStatusModal?.() },
    { icon: CheckSquare, label: 'Follow ups', path: '/dashboard/tasks', onClick: () => navigate('/dashboard/tasks') },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings', onClick: () => navigate('/dashboard/settings') },
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
            (item.label === 'Status' && location.pathname === '/status');
          
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
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5",
                  isActive && "text-accent-primary"
                )} />
                {item.label === 'Status' && (
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
                    getUserStatusDotColor(userStatus!)
                  )} />
                )}
              </div>
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