
import React, { useState } from "react";
import { ThumbsUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import SnoozeReasonModal, { SnoozeReason } from "./SnoozeReasonModal";

interface ActionItemControlsProps {
  itemId: string;
  itemTitle: string;
  sender?: string;
  onThumbsUp?: (itemId: string) => void;
  onSnooze?: (itemId: string, reason: SnoozeReason, feedback?: string) => void;
  className?: string;
  size?: "sm" | "default";
}

const ActionItemControls = ({ 
  itemId, 
  itemTitle,
  sender,
  onThumbsUp, 
  onSnooze, 
  className = "", 
  size = "default" 
}: ActionItemControlsProps) => {
  const [thumbsUpActive, setThumbsUpActive] = useState(false);
  const [snoozed, setSnoozed] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);

  const handleThumbsUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    setThumbsUpActive(true);
    onThumbsUp?.(itemId);
  };

  const handleSnoozeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSnoozeModal(true);
  };

  const handleSnoozeConfirm = (reason: SnoozeReason, feedback?: string) => {
    setSnoozed(true);
    onSnooze?.(itemId, reason, feedback);
  };

  const buttonSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  if (snoozed) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        <span className="text-xs text-text-muted">Snoozed</span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} p-0 transition-all ${
                thumbsUpActive 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'text-text-secondary hover:text-green-400 hover:bg-green-500/10'
              }`}
              onClick={handleThumbsUp}
              disabled={thumbsUpActive}
            >
              <ThumbsUp className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Mark as helpful</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={`${buttonSize} p-0 text-text-secondary hover:text-orange-400 hover:bg-orange-500/10 transition-all`}
              onClick={handleSnoozeClick}
            >
              <Clock className={iconSize} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Snooze forever</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <SnoozeReasonModal
        isOpen={showSnoozeModal}
        onClose={() => setShowSnoozeModal(false)}
        onSnooze={handleSnoozeConfirm}
        itemTitle={itemTitle}
        sender={sender}
      />
    </TooltipProvider>
  );
};

export default ActionItemControls;
