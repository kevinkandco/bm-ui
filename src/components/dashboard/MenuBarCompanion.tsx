
import React, { useState } from "react";
import { Clock, Calendar, Zap, ChevronRight, Settings, ExternalLink, X, CheckCircle, AlertCircle } from "lucide-react";
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

  return (
    <div className="fixed top-12 right-4 z-50">
      {/* macOS-style popover */}
      <div className="relative">
        {/* Arrow */}
        <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-xl rotate-45 border-l border-t border-gray-200/50" />
        
        {/* Main popover */}
        <div className="w-80 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-2xl overflow-hidden">
          {/* Header with Status */}
          <div className="p-4 border-b border-gray-200/30">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[17px] font-semibold text-gray-900">Brief Me</h3>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            
            {/* Status Control */}
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
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            {/* Recent Brief */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-medium text-gray-700">Recent Brief</h4>
              <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-accent-primary" />
                    <span className="text-[13px] font-medium text-gray-900">Morning Brief</span>
                  </div>
                  <span className="text-[11px] text-gray-500">8:30 AM</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">33 min saved</p>
              </div>
            </div>

            {/* Upcoming Brief */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-medium text-gray-700">Upcoming Brief</h4>
              <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-[13px] font-medium text-gray-900">Midday Brief</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500">12:30 PM</span>
                    <Button
                      onClick={onUpdateSchedule}
                      variant="ghost"
                      size="sm"
                      className="h-5 px-1 text-[10px] text-gray-500 hover:text-gray-700"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrations Status */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-medium text-gray-700">Integrations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[12px] text-gray-900">Slack</span>
                  </div>
                  <span className="text-[11px] text-gray-500">12 messages</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-[12px] text-gray-900">Mail</span>
                  </div>
                  <span className="text-[11px] text-gray-500">5 emails</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 text-orange-500" />
                    <span className="text-[12px] text-gray-900">Calendar</span>
                  </div>
                  <span className="text-[11px] text-gray-500">Needs setup</span>
                </div>
              </div>
            </div>

            {/* Primary Action */}
            <Button
              onClick={onGetBriefedNow}
              className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white rounded-lg py-3 text-[13px] font-medium transition-all duration-150 ease-in-out"
            >
              <Zap className="w-4 h-4 mr-2" />
              Get Briefed Now
            </Button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200/30 bg-gray-50/30">
            <div className="flex justify-between items-center text-[11px]">
              <button 
                onClick={handleSettings}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <Settings className="w-3 h-3 inline mr-1" />
                Settings
              </button>
              <button 
                onClick={onOpenDashboard}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-150"
              >
                <ExternalLink className="w-3 h-3 inline mr-1" />
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
