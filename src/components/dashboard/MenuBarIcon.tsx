
import React from "react";
import { Zap, ChevronDown, Calendar, ExternalLink, Settings, X, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "offline": return "bg-gray-500";
      case "dnd": return "bg-red-500";
      default: return "bg-green-500";
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

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-0 rounded-full transition-all duration-200 ease-in-out backdrop-blur-md bg-white/10 text-white">
        {/* Status Indicator - Clickable outside dropdown */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-l-full px-4 py-2.5 transition-all duration-150"
          onClick={handleStatusClick}
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-medium">Brief Me</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`} />
            <span className="text-xs">{getStatusText(currentStatus)}</span>
          </div>
        </div>

        {/* Dropdown Menu - Separate clickable area */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-auto px-3 py-2.5 rounded-r-full hover:bg-white/20 border-l border-white/20"
            >
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="end" 
            className="w-80 bg-white/95 backdrop-blur-xl border border-gray-200/50 p-0 rounded-xl shadow-2xl"
          >
            {/* Header with Close */}
            <div className="p-4 border-b border-gray-200/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[17px] font-semibold text-gray-900">Brief Me</h3>
              </div>
              
              {/* Status Control - Moved to top */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {["active", "offline", "dnd"].map((statusOption) => (
                  <button
                    key={statusOption}
                    onClick={() => onStatusChange(statusOption as "active" | "offline" | "dnd")}
                    className={`px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-150 ease-in-out ${
                      currentStatus === statusOption
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {statusOption === "dnd" ? "DND" : statusOption.charAt(0).toUpperCase() + statusOption.slice(1)}
                  </button>
                ))}
              </div>

              {/* Primary Action - Moved to top */}
              {onGetBriefedNow && (
                <Button
                  onClick={onGetBriefedNow}
                  className="w-full bg-gradient-to-r from-[#458888] to-[#50A181] hover:from-[#3D7A7A] hover:to-[#489174] text-white rounded-xl py-3 text-[13px] font-medium transition-all duration-150 ease-in-out"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Get Briefed Now
                </Button>
              )}
            </div>

            {/* Brief Status */}
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-[15px] font-medium text-gray-900">Morning Brief Ready</span>
                    </div>
                    <X className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-[13px] text-gray-600">~33 min saved so far</p>
                </div>
              </div>

              {/* Upcoming Brief */}
              <div className="space-y-2">
                <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-200/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-[13px] font-medium text-gray-900">Midday Brief • 12:30 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500">Edit</span>
                      <ChevronRight className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Integration Counts */}
              <div className={`grid gap-4 py-2 ${integrations.length <= 3 ? 'grid-cols-3' : integrations.length <= 4 ? 'grid-cols-4' : 'grid-cols-2'}`}>
                {integrations.map((integration, index) => (
                  <div key={integration.name} className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{integration.count}</div>
                    <div className="text-[13px] text-gray-600">{integration.name}</div>
                    {integration.isConnected && (
                      <div className="w-2 h-2 rounded-full bg-green-500 mx-auto mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-gray-200/30 bg-gray-50/30">
              <div className="flex justify-between items-center text-[11px]">
                <button 
                  onClick={onToggleMenu}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-150 flex items-center gap-1"
                >
                  <Settings className="w-3 h-3" />
                  Preferences
                </button>
                <button 
                  onClick={onOpenDashboard}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-150 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Open Dashboard
                </button>
                <button className="text-red-500 hover:text-red-700 transition-colors duration-150">
                  Quit
                </button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MenuBarIcon;
