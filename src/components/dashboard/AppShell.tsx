import React from 'react';
import { cn } from '@/lib/utils';

interface AppShellProps {
  leftNav: React.ReactNode;
  mainContent: React.ReactNode;
  rightPanel?: React.ReactNode;
  playerBar?: React.ReactNode;
  className?: string;
}

export const AppShell = ({ 
  leftNav, 
  mainContent, 
  rightPanel, 
  playerBar, 
  className 
}: AppShellProps) => {
  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      <div className="flex-1 flex">
        {/* Left Navigation */}
        {leftNav}
        
        {/* Main Content Area */}
        <div className="flex-1 relative">
          {mainContent}
          
          {/* Right Panel Overlay */}
          {rightPanel}
        </div>
      </div>
      
      {/* Player Bar - Fixed at bottom */}
      {playerBar}
    </div>
  );
};