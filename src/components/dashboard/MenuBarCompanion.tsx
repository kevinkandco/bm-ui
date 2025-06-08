
import React, { useState } from "react";
import { Clock, Calendar, Zap, ChevronRight, Settings, ExternalLink, X } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGetBriefedNow = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate generation
      onGetBriefedNow();
      toast({
        title: "Brief Generated",
        description: "Your morning brief is ready"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus === "dnd" ? "Do Not Disturb" : newStatus}`
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-12 right-4 z-50">
      {/* macOS-style popover */}
      <div className="relative">
        {/* Arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-xl rotate-45 border-l border-t border-gray-200/50" />
        
        {/* Main popover */}
        <div className="w-80 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-[17px] font-semibold text-gray-900">Morning Brief Ready</h3>
                <p className="text-[13px] text-gray-600">~33 min saved so far</p>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Upcoming Brief */}
            <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-[13px] font-medium text-gray-900">Midday Brief • 12:30 PM</span>
                </div>
                <Button
                  onClick={onUpdateSchedule}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-[11px] text-gray-500 hover:text-gray-700"
                >
                  Edit <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-50/80 rounded-lg p-3 text-center border border-gray-200/30">
                <div className="text-[15px] font-semibold text-gray-900">12</div>
                <div className="text-[11px] text-gray-600">Slack</div>
                <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1" />
              </div>
              <div className="bg-gray-50/80 rounded-lg p-3 text-center border border-gray-200/30">
                <div className="text-[15px] font-semibold text-gray-900">5</div>
                <div className="text-[11px] text-gray-600">Mail</div>
              </div>
              <div className="bg-gray-50/80 rounded-lg p-3 text-center border border-gray-200/30">
                <div className="text-[15px] font-semibold text-gray-900">4</div>
                <div className="text-[11px] text-gray-600">Actions</div>
              </div>
            </div>

            {/* Status Control */}
            <div className="space-y-3">
              {/* Segmented Control */}
              <div className="bg-gray-100/80 rounded-lg p-1 grid grid-cols-3 gap-1">
                {["active", "offline", "dnd"].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => handleStatusChange(statusOption as StatusType)}
                    className={`px-3 py-2 text-[13px] font-medium rounded-md transition-all duration-150 ease-in-out ${
                      status === statusOption
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {statusOption === "dnd" ? "DND" : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>

              {/* Primary Action */}
              <Button
                onClick={handleGetBriefedNow}
                disabled={isGenerating}
                className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg py-3 text-[13px] font-medium transition-all duration-150 ease-in-out"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Get Briefed Now"}
              </Button>

              {/* Secondary Action */}
              <Button
                onClick={onUpdateSchedule}
                variant="outline"
                className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 rounded-full py-2 text-[13px] transition-all duration-150 ease-in-out"
              >
                Update Schedule
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200/30 bg-gray-50/30">
            <div className="flex justify-between items-center text-[11px]">
              <button className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
                <Settings className="w-3 h-3 inline mr-1" />
                Preferences
              </button>
              <button 
                onClick={onOpenDashboard}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <ExternalLink className="w-3 h-3 inline mr-1" />
                Open Dashboard
              </button>
              <button className="text-red-500 hover:text-red-700 transition-colors duration-150">
                Quit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuBarCompanion;
