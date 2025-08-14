
import React, { useState } from "react";
import { Clock, Calendar, Zap, ChevronRight, Settings, ExternalLink, X, CheckCircle, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MenuBarCompanionProps {
  isOpen: boolean;
  onClose: () => void;
  onGetBriefedNow: () => void;
  onUpdateSchedule: () => void;
  onOpenDashboard: () => void;
}

type StatusType = "active" | "offline" | "dnd";

const MenuBarCompanion = ({ 
  isOpen, 
  onClose, 
  onGetBriefedNow, 
  onUpdateSchedule, 
  onOpenDashboard 
}: MenuBarCompanionProps) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<StatusType>("active");

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus === "dnd" ? "Do Not Disturb" : newStatus}`
    });
  };

  const handleSettings = () => {
    toast({
      title: "Opening Settings",
      description: "Navigating to settings..."
    });
    onClose();
  };

  if (!isOpen) return null;

  const getUserStatusDotColor = (status: StatusType) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "offline":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case "dnd":
        return "Focus";
      case "offline":
        return "Away";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="fixed top-12 right-4 z-50">
      {/* macOS-style popover */}
      <div className="relative">
        {/* Arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 rotate-45 border-l border-t border-[var(--border-subtle)]" 
             style={{ background: 'var(--gradient-menu-bar)' }} />
        
        {/* Main popover */}
        <div className="w-80 backdrop-blur-xl rounded-xl border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
             style={{ background: 'var(--gradient-menu-bar)' }}>
          {/* Header with Greeting */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Good morning, Alex
              </h1>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-white/10 rounded-full text-[var(--text-muted)]"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              I'm here with you — let's make the most of today.
            </p>
            
            {/* Status & Next Brief Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getUserStatusDotColor(status)}`} />
                <span className="text-xs text-[var(--text-secondary)] capitalize">
                  {getStatusLabel(status)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <span>Next brief at 2:15 PM</span>
                <button 
                  className="text-[var(--brand-300)] hover:text-[var(--brand-200)] underline ml-1"
                  onClick={onGetBriefedNow}
                >
                  Get it now
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6">
            {/* Primary Action Button */}
            <Button
              onClick={onGetBriefedNow}
              className="w-full h-8 px-4 rounded-full bg-gradient-to-r from-[var(--brand-200)] to-[#277F64] hover:opacity-90 text-white font-medium transition-all duration-150 ease-in-out"
            >
              Brief Me
            </Button>

            {/* Today's Updates Section */}
            <div>
              <h2 className="text-[var(--text-primary)] font-semibold text-lg tracking-tight mb-4">
                Today's Updates
              </h2>

              {/* Brief Card */}
              <div className="bg-[var(--brand-600)] rounded-xl p-3 hover:bg-white/[0.04] transition-colors border border-[var(--border-subtle)]">
                <div className="flex items-center gap-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 w-10 p-0 rounded-full bg-[var(--brand-300)]/15 hover:bg-[var(--brand-300)]/25 transition-all duration-200"
                  >
                    <Play className="h-5 w-5 text-[var(--brand-300)] fill-current" />
                  </Button>
                  <div>
                    <div className="text-[var(--text-primary)] font-semibold text-sm leading-tight tracking-tight">
                      Morning Brief
                    </div>
                    <div className="text-[var(--text-secondary)] text-xs">
                      Today, 8:30 AM
                    </div>
                  </div>
                </div>
                <div className="text-[var(--text-muted)] text-xs">
                  12 Slack • 5 Emails • 3 Actions
                </div>
              </div>
            </div>

            {/* Upcoming Brief */}
            <div>
              <div className="bg-[var(--brand-600)] rounded-xl p-3 border border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">Midday Brief</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--text-secondary)]">12:30 PM</span>
                    <Button
                      onClick={onUpdateSchedule}
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--brand-700)]">
            <div className="flex justify-between items-center text-xs">
              <button 
                onClick={handleSettings}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150 flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                Settings
              </button>
              <button 
                onClick={onOpenDashboard}
                className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors duration-150 flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBarCompanion;
