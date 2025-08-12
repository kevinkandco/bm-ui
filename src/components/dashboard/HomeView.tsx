import React, { useCallback, useMemo } from "react";
import { Zap, Focus, Clock, X, Play, Pause, ChevronDown, Calendar, User, Settings, PanelLeftClose, PanelRightClose, CheckSquare, PanelLeftOpen, Mail, Kanban, Info, Users, Check, BookOpen, Home, FileText, ClipboardCheck, Pencil, Mic } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import MenuBarIcon from "./MenuBarIcon";
import SignalSweepBar from "../visuals/SignalSweepBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/dashboard-card";

// Optimized imports
import { useHomeViewState } from '@/hooks/useHomeViewState';
import OptimizedBriefsSection from './HomeViewSections/OptimizedBriefsSection';
import OptimizedStatusSection from './HomeViewSections/OptimizedStatusSection';
import MobileHomeView from "./MobileHomeView";
import MobileBottomNav from "./MobileBottomNav";
import MobileStatusModal from "./MobileStatusModal";
import BriefDrawer from "./BriefDrawer";
import AudioPlayer from "./AudioPlayer";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onStartFocusMode: () => void;
  onSignOffForDay: () => void;
  userStatus?: "active" | "away" | "focus" | "vacation";
  focusConfig?: any;
  onStatusChange?: (status: "active" | "away" | "focus" | "vacation") => void;
  onExitFocusMode?: () => void;
  onSignBackOn?: () => void;
}

const OptimizedHomeView = ({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay,
  userStatus = "active",
  onStatusChange,
  onExitFocusMode,
  onSignBackOn
}: HomeViewProps) => {
  // Hooks
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Optimized state management
  const {
    state,
    updateState,
    briefsData,
    meetingsData
  } = useHomeViewState();

  // Destructure state for easier access
  const {
    playingBrief,
    showStatusModal,
    showMobileBriefDrawer,
    selectedBrief,
    isHomeSelected
  } = state;

  const { allBriefs, recentBriefs, upcomingBriefs, followUps } = briefsData;

  // Memoized handlers to prevent unnecessary re-renders
  const handlePlayBrief = useCallback((briefId: number) => {
    if (playingBrief === briefId) {
      updateState({
        playingBrief: null,
        selectedTranscript: null,
        selectedMessage: null
      });
    } else {
      updateState({ 
        playingBrief: briefId,
        rightPanelCollapsed: false
      });
    }
  }, [playingBrief, updateState]);

  const handleOpenMobileBrief = useCallback((briefId: number) => {
    updateState({
      selectedBrief: briefId,
      showMobileBriefDrawer: true
    });
  }, [updateState]);

  const handleStatusSelect = useCallback((status: 'online' | 'focus' | 'vacation' | 'offline') => {
    const statusMap: Record<string, 'active' | 'away' | 'focus' | 'vacation'> = {
      'online': 'active',
      'focus': 'focus', 
      'vacation': 'vacation',
      'offline': 'away'
    };
    const newStatus = statusMap[status];
    onStatusChange?.(newStatus);
    updateState({ currentStatus: status });
    if (status === 'focus') {
      onStartFocusMode();
    }
  }, [onStatusChange, onStartFocusMode, updateState]);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="relative">
        <MobileHomeView 
          onPlayBrief={handlePlayBrief} 
          playingBrief={playingBrief} 
          onOpenBrief={handleOpenMobileBrief} 
          onStartFocusMode={onStartFocusMode} 
          onBriefMe={onToggleCatchMeUp} 
          userStatus={userStatus} 
          onStatusChange={onStatusChange} 
        />
        
        <MobileBottomNav 
          onShowStatusModal={() => updateState({ showStatusModal: true })} 
          userStatus={userStatus} 
        />
        
        {playingBrief && (
          <div onClick={() => handleOpenMobileBrief(playingBrief)}>
            <AudioPlayer 
              briefId={playingBrief} 
              briefName={allBriefs.find(b => b.id === playingBrief)?.name}
              briefTime={allBriefs.find(b => b.id === playingBrief)?.timeCreated}
              onClose={() => updateState({ playingBrief: null })}
            />
          </div>
        )}

        <MobileStatusModal 
          isOpen={showStatusModal} 
          onClose={() => updateState({ showStatusModal: false })} 
          onSelectStatus={handleStatusSelect} 
          currentStatus={userStatus === 'active' ? 'online' : userStatus} 
        />

        <BriefDrawer 
          open={showMobileBriefDrawer} 
          briefId={selectedBrief} 
          onClose={() => updateState({ showMobileBriefDrawer: false })} 
        />
      </div>
    );
  }

  // Desktop layout - simplified structure
  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="bg-surface/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" alt="Brief Me" className="h-8 w-auto" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      userStatus === "active" ? "bg-green-500" : 
                      userStatus === "away" ? "bg-yellow-500" : 
                      userStatus === "focus" ? "bg-blue-500" : 
                      userStatus === "vacation" ? "bg-gray-500" : "bg-green-500"
                    }`} />
                    <span className="text-sm text-text-secondary capitalize">{userStatus}</span>
                    <ChevronDown className="w-3 h-3 text-text-secondary" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => onStatusChange?.('active')}>
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onStartFocusMode}>
                    <Focus className="h-4 w-4 mr-2" />
                    Focus Mode
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.('away')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Away
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusChange?.('vacation')}>
                    <X className="h-4 w-4 mr-2" />
                    Vacation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-4">
              <MenuBarIcon 
                onToggleMenu={() => {}} 
                onStatusChange={onStatusChange} 
                currentStatus={userStatus} 
              />
              <Button onClick={onOpenBriefModal} variant="default" className="rounded-full">
                Brief Me
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <OptimizedStatusSection
                userStatus={userStatus}
                onStatusChange={onStatusChange}
                onOpenBriefModal={onOpenBriefModal}
              />
              
              <OptimizedBriefsSection
                allBriefs={allBriefs}
                recentBriefs={recentBriefs}
                upcomingBriefs={upcomingBriefs}
                playingBrief={playingBrief}
                onPlayBrief={handlePlayBrief}
                onViewTranscript={onViewTranscript}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Today's Schedule</h2>
                {meetingsData.hasUpcomingMeetings ? (
                  <div className="space-y-4">
                    {meetingsData.upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="p-4 rounded-lg hover:bg-surface-raised/10 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-base font-medium text-text-primary">{meeting.title}</h3>
                            <p className="text-sm text-text-secondary">{meeting.time} • {meeting.duration}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 mx-auto mb-3 text-text-secondary" />
                    <p className="text-sm text-text-secondary">No meetings soon</p>
                  </div>
                )}
              </div>

              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Follow ups</h2>
                {followUps.length > 0 ? (
                  <div className="space-y-3">
                    {followUps.slice(0, 3).map((item) => (
                      <div key={item.id} className="p-3 rounded-lg hover:bg-surface-raised/10 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            item.priority === 'High' ? 'bg-orange-500' :
                            item.priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-text-primary">{item.message}</p>
                            <p className="text-xs text-text-secondary mt-1">{item.sender} • {item.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary">No follow-ups</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OptimizedHomeView;