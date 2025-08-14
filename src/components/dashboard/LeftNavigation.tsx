import React from 'react';
import { Home, FileText, Calendar, CheckSquare, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusMenu, StatusType } from './StatusMenu';
import { QuickChips, QuickChip } from './QuickChips';
import { cn } from '@/lib/utils';

export interface LeftNavigationProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  userStatus: StatusType;
  onStatusChange: (status: StatusType) => void;
  quickChips?: QuickChip[];
  onQuickChipClick?: (chip: QuickChip) => void;
  className?: string;
}

export const LeftNavigation = ({
  collapsed,
  onToggleCollapse,
  currentPage,
  onNavigate,
  userStatus,
  onStatusChange,
  quickChips = [],
  onQuickChipClick,
  className
}: LeftNavigationProps) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'briefs', label: 'Briefs', icon: FileText },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={cn(
      "bg-brand-800 border-r border-border-subtle flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-text-primary">
              Brief Me
            </h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "w-full justify-start gap-3 h-10",
                  isActive && "bg-brand-600 text-text-primary",
                  collapsed && "justify-center"
                )}
              >
                <Icon className="h-4 w-4" />
                {!collapsed && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>
      </div>

      {/* Status & Quick Actions */}
      {!collapsed && (
        <div className="border-t border-border-subtle">
          {/* Status */}
          <div className="p-4">
            <StatusMenu
              value={userStatus}
              onChange={onStatusChange}
              className="w-full"
            />
          </div>

          {/* Quick Chips */}
          {quickChips.length > 0 && onQuickChipClick && (
            <QuickChips
              chips={quickChips}
              onClick={onQuickChipClick}
            />
          )}
        </div>
      )}
    </div>
  );
};