
import React, { useState } from "react";
import { Search, Users, FileText, CheckSquare, Calendar, Settings, LogOut, Gift, ChevronDown, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import StatusUpdateDropdown from "../StatusUpdateDropdown";
import TeamsInviteModal from "./TeamsInviteModal";
import ReferralSection from "./ReferralSection";

interface DashboardSidebarProps {
  userStatus: "active" | "away" | "focus" | "vacation";
  onStatusChange: (status: "active" | "away" | "focus" | "vacation") => void;
  onToggleFocusMode: () => void;
  onSignOffForDay: () => void;
}

const DashboardSidebar = ({ 
  userStatus, 
  onStatusChange, 
  onToggleFocusMode, 
  onSignOffForDay 
}: DashboardSidebarProps) => {
  const navigate = useNavigate();
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigationItems = [
    { icon: FileText, label: "Briefs", path: "/dashboard", active: true },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
    { icon: Calendar, label: "Meetings", path: "/dashboard/meetings" }
  ];

  const priorityItems = [
    { label: "Priority People", count: 12 },
    { label: "Priority Channels", count: 8 },
    { label: "Priority Topics", count: 5 }
  ];

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Handle search functionality
      console.log('Search:', searchQuery);
    }
  };

  return (
    <div className="w-64 h-screen bg-surface border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border-subtle">
        <h1 className="text-xl font-semibold text-text-primary">Brief Me</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Status Update */}
        <div className="p-4 border-b border-border-subtle">
          <StatusUpdateDropdown
            currentStatus={userStatus}
            onStatusChange={onStatusChange}
            onToggleFocusMode={onToggleFocusMode}
            onSignOffForDay={onSignOffForDay}
          />
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-subtle">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              className="pl-10 pr-16 bg-white/5 border-white/20 text-text-primary"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <Command className="h-3 w-3 text-text-secondary" />
              <span className="text-xs text-text-secondary">K</span>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="p-4 border-b border-border-subtle">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active 
                    ? 'bg-primary-teal/20 text-primary-teal' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priorities Section */}
        <div className="p-4 border-b border-border-subtle">
          <h3 className="text-sm font-medium text-text-primary mb-3">Priorities</h3>
          <div className="space-y-2">
            {priorityItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-text-secondary">{item.label}</span>
                <Badge variant="secondary" className="bg-white/10 text-text-primary">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Teams Section */}
        <div className="p-4 border-b border-border-subtle">
          <h3 className="text-sm font-medium text-text-primary mb-3">Teams</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTeamsModal(true)}
            className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-white/5"
          >
            <Users className="h-4 w-4 mr-2" />
            Invite team
          </Button>
        </div>

        {/* Referral Section */}
        <div className="p-4 border-b border-border-subtle">
          <ReferralSection />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Profile Section */}
        <div className="p-4 border-t border-border-subtle">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-primary-teal/20 text-primary-teal">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-text-primary">John Doe</p>
                    <p className="text-xs text-text-secondary">john@company.com</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-text-secondary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-surface border border-border-subtle">
              <DropdownMenuItem 
                onClick={() => navigate('/settings')}
                className="text-text-primary hover:bg-white/10"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/settings/integrations')}
                className="text-text-primary hover:bg-white/10"
              >
                <Users className="mr-2 h-4 w-4" />
                Integrations
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/settings/brief')}
                className="text-text-primary hover:bg-white/10"
              >
                <FileText className="mr-2 h-4 w-4" />
                Brief Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border-subtle" />
              <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Teams Modal */}
      <TeamsInviteModal 
        open={showTeamsModal}
        onClose={() => setShowTeamsModal(false)}
      />
    </div>
  );
};

export default DashboardSidebar;
