import React, { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';

interface OptimizedStatusSectionProps {
  userStatus: 'active' | 'away' | 'focus' | 'vacation';
  onStatusChange?: (status: 'active' | 'away' | 'focus' | 'vacation') => void;
  onOpenBriefModal: () => void;
}

const STATUS_MESSAGES = {
  active: "I'm here with you — let's make the most of today.",
  away: "Step away and enjoy your day — I'll take care of the rest.",
  focus: "Stay in the flow — I'll handle what can wait.",
  vacation: "Switch off and make the most of your time away — I've got this."
};

const BRIEF_BUTTON_LABELS = {
  active: "Brief Me",
  away: "Get Catch-Up Brief", 
  focus: "Get Brief Anyway",
  vacation: "Preview OOO Brief"
};

const OptimizedStatusSection = memo(({
  userStatus,
  onStatusChange,
  onOpenBriefModal
}: OptimizedStatusSectionProps) => {
  const statusMessage = useMemo(() => STATUS_MESSAGES[userStatus], [userStatus]);
  const buttonLabel = useMemo(() => BRIEF_BUTTON_LABELS[userStatus], [userStatus]);

  return (
    <div className="glass-panel p-6 space-y-4">
      <p className="text-text-secondary">{statusMessage}</p>
      <Button 
        onClick={onOpenBriefModal}
        className="w-full"
        variant="default"
      >
        {buttonLabel}
      </Button>
    </div>
  );
});

OptimizedStatusSection.displayName = 'OptimizedStatusSection';

export default OptimizedStatusSection;