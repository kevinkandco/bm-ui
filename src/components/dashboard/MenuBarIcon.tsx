
import React, { useState } from "react";
import { Zap, ChevronDown, Calendar, ExternalLink, Settings, X, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BriefMeModal from "./BriefMeModal";
import { useToast } from "@/hooks/use-toast";

interface Integration {
  name: string;
  count: number;
  isConnected?: boolean;
}

interface MenuBarIconProps {
  onToggleMenu: () => void;
  onStatusChange: (status: "active" | "offline" | "dnd") => void;
  currentStatus: "active" | "offline" | "dnd";
  isMenuOpen?: boolean;
  onGetBriefedNow?: () => void;
  onUpdateSchedule?: () => void;
  onOpenDashboard?: () => void;
  integrations?: Integration[];
}

const MenuBarIcon = ({ 
  onToggleMenu, 
  onStatusChange, 
  currentStatus,
  isMenuOpen = false,
  onGetBriefedNow,
  onUpdateSchedule,
  onOpenDashboard,
  integrations = [
    { name: "Slack", count: 12, isConnected: true },
    { name: "Mail", count: 5, isConnected: false },
    { name: "Actions", count: 4, isConnected: false }
  ]
}: MenuBarIconProps) => {
  const { toast } = useToast();
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500 shadow-status-green";
      case "offline": return "bg-gray-500";
      case "dnd": return "bg-red-500 shadow-status-red";
      default: return "bg-green-500 shadow-status-green";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "offline": return "Offline";
      case "dnd": return "Do Not Disturb";
      default: return "Active";
    }
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusOptions: ("active" | "offline" | "dnd")[] = ["active", "offline", "dnd"];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % statusOptions.length;
    onStatusChange(statusOptions[nextIndex]);
  };

  const handleGetBriefedNow = () => {
    setShowBriefMeModal(true);
  };

  const handleGenerateBrief = () => {
    if (onGetBriefedNow) {
      onGetBriefedNow();
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-0 chrome-pill glass-layer-group text-glass-primary">
          {/* Status Indicator - glass styling */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-glass-ultra-thin rounded-l-full px-4 py-2.5 transition-all duration-150 spring-scale"
            onClick={handleStatusClick}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 glass-icon" strokeWidth={1.5} />
              <span className="text-sm font-medium">Brief Me</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`} />
              <span className="text-xs">{getStatusText(currentStatus)}</span>
            </div>
          </div>

          {/* Dropdown Menu with glass styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto px-3 py-2.5 rounded-r-full hover:bg-glass-ultra-thin glass-divider border-l spring-scale"
              >
                <ChevronDown className="w-3 h-3 glass-icon" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              align="end" 
              className="w-80 glass-thick border border-rim-light p-0 rounded-3xl shadow-glass-elevated"
            >
              {/* Header */}
              <div className="p-4 glass-divider">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[17px] font-semibold text-glass-primary">Brief Me</h3>
                </div>
                
                {/* Status Control - glass chips */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["active", "offline", "dnd"].map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => onStatusChange(statusOption as "active" | "offline" | "dnd")}
                      className={`monitoring-chip px-3 py-2 text-[13px] font-medium transition-all duration-150 ease-in-out spring-scale ${
                        currentStatus === statusOption
                          ? "glass-thick text-glass-primary"
                          : "glass-ultra-thin text-glass-secondary hover:bg-glass-thin"
                      }`}
                    >
                      {statusOption === "dnd" ? "DND" : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Primary Action */}
                <Button
                  onClick={handleGetBriefedNow}
                  className="chrome-pill w-full py-3 text-[13px] font-medium"
                >
                  <Zap className="w-4 h-4 mr-2 glass-icon" />
                  Get Briefed Now
                </Button>
              </div>

              {/* Brief Status with glass styling */}
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <div className="glass-ultra-thin rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full status-glow-green flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600 glass-icon" />
                        </div>
                        <span className="text-[15px] font-medium text-glass-primary">Morning Brief Ready</span>
                      </div>
                      <X className="w-4 h-4 text-glass-secondary glass-icon" />
                    </div>
                    <p className="text-[13px] text-glass-secondary">~33 min saved so far</p>
                  </div>
                </div>

                {/* Upcoming Brief */}
                <div className="space-y-2">
                  <div className="glass-ultra-thin rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-glass-secondary glass-icon" />
                        <span className="text-[13px] font-medium text-glass-primary">Midday Brief • 12:30 PM</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-glass-secondary">Edit</span>
                        <ChevronRight className="w-3 h-3 text-glass-secondary glass-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Integration Counts with glass styling */}
                <div className={`grid gap-4 py-2 ${integrations.length <= 3 ? 'grid-cols-3' : integrations.length <= 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  {integrations.map((integration, index) => (
                    <div key={integration.name} className="text-center">
                      <div className="text-2xl font-bold text-glass-primary">{integration.count}</div>
                      <div className="text-[13px] text-glass-secondary">{integration.name}</div>
                      {integration.isConnected && (
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-status-green mx-auto mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer with glass styling */}
              <div className="px-4 py-3 glass-divider">
                <div className="flex justify-center gap-3">
                  {/* Brief Me Button */}
                  <button 
                    onClick={handleGetBriefedNow}
                    className="chrome-pill w-12 h-12 flex items-center justify-center spring-scale"
                    title="Brief Me"
                  >
                    <Zap className="w-5 h-5 glass-icon" />
                  </button>
                  
                  {/* Status Button */}
                  <button 
                    onClick={handleStatusClick}
                    className="chrome-pill w-12 h-12 flex items-center justify-center spring-scale"
                    title="Toggle Status"
                  >
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`} />
                  </button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Brief Me Modal */}
      <BriefMeModal
        open={showBriefMeModal}
        onClose={() => setShowBriefMeModal(false)}
        onGenerateBrief={handleGenerateBrief}
      />
    </>
  );
};

export default MenuBarIcon;
