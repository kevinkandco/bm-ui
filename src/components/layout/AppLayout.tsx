import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  FileText, 
  CheckSquare, 
  Calendar, 
  Cog, 
  ArrowLeft, 
  Zap,
  Users,
  Mail,
  Menu
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, currentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);

  const handleToggleNav = () => {
    setIsNavCollapsed(prev => !prev);
  };

  const handleViewAllBriefs = () => {
    navigate('/dashboard/briefs');
  };

  const handleViewAllTasks = () => {
    navigate('/dashboard/follow-ups');
  };

  const handleViewAllMeetings = () => {
    navigate('/dashboard/meetings');
  };

  const handleAllSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  const handleOpenBriefModal = () => {
    // This would open the brief modal - for now just navigate to home
    navigate('/dashboard');
  };

  // Connected integrations data
  const connectedIntegrations = [
    { name: 'Slack', channels: '12' },
    { name: 'Gmail', emails: '47' },
    { name: 'Calendar', events: '8' }
  ];

  const upcomingBrief = {
    scheduledTime: "9:00 AM"
  };

  // Determine active page based on current route
  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'home';
    if (path.includes('/briefs')) return 'briefs';
    if (path.includes('/follow-ups')) return 'follow-ups';
    if (path.includes('/meetings')) return 'meetings';
    if (path.includes('/settings')) return 'settings';
    return currentPage || 'home';
  };

  const activePage = getActivePage();

  return (
    <div className="min-h-screen flex">
      {/* Full Height Sidebar - Made Narrower and Collapsible */}
      <div 
        className={`${isNavCollapsed ? 'w-16 cursor-pointer' : 'w-64'} bg-surface-raised/20 flex flex-col transition-all duration-300 ease-in-out`}
        onClick={isNavCollapsed ? handleToggleNav : undefined}
      >
        <div className="p-4 pt-12 space-y-4 flex-1">
          {/* Profile Section - Moved to top, removed email */}
          <div 
            className={`flex items-center gap-3 p-3 rounded-lg relative group transition-all duration-200 ${isNavCollapsed ? 'justify-center' : ''} ${isProfileHovered ? 'bg-white/5' : ''}`}
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <Avatar className={`${isNavCollapsed ? 'w-6 h-6' : 'w-8 h-8'}`}>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary-teal text-white text-sm">AK</AvatarFallback>
            </Avatar>
            {!isNavCollapsed && (
              <div className="text-left">
                <p className="text-white-text text-sm font-medium">Alex</p>
              </div>
            )}
            {/* Desktop collapse arrow - only show on hover and when not collapsed */}
            {!isNavCollapsed && isProfileHovered && (
              <button
                onClick={handleToggleNav}
                className="absolute right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-light-gray-text" />
              </button>
            )}
          </div>

          {/* Connected Integrations Status - Full Width */}
          {!isNavCollapsed && (
            <div className="flex gap-2">
              {connectedIntegrations.map((integration, i) => (
                <div key={i} className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200 flex-1 justify-center">
                  <div className="flex items-center justify-center relative">
                    {integration.name === 'Slack' && <div className="w-3 h-3 text-primary-teal"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg></div>}
                    {integration.name === 'Gmail' && <Mail className="w-3 h-3 text-primary-teal" />}
                    {integration.name === 'Calendar' && <Calendar className="w-3 h-3 text-primary-teal" />}
                    {/* Status dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 bg-green-400"></div>
                  </div>
                  {/* Count badge */}
                  <span className="text-xs font-medium text-white">
                    {integration.channels || integration.emails || integration.events}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Brief - Time on right side */}
          {!isNavCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-text-secondary text-xs text-left">Upcoming brief</p>
                <p className="text-text-primary text-xs font-medium">{upcomingBrief.scheduledTime}</p>
              </div>
            </div>
          )}

          {/* Brief Me Button - Left aligned */}
          <Button onClick={handleOpenBriefModal} className={`w-full bg-primary-teal hover:bg-primary-teal/90 text-white rounded-md py-2 font-medium text-sm shadow-none ${isNavCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
            {isNavCollapsed ? <Zap className="w-4 h-4" /> : 'Brief Me'}
          </Button>

          {/* Navigation Items - Added hover states, reduced text size, left aligned */}
          <div className="space-y-1">
            <button onClick={() => navigate('/dashboard')} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''} ${activePage === 'home' ? 'text-primary-teal' : ''}`}>
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {!isNavCollapsed && <span className="font-medium text-sm">Home</span>}
            </button>
            <button onClick={handleViewAllBriefs} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''} ${activePage === 'briefs' ? 'text-primary-teal' : ''}`}>
              <FileText className={`w-4 h-4 group-hover:scale-110 transition-all ${activePage === 'briefs' ? 'text-primary-teal' : 'text-light-gray-text group-hover:text-primary-teal'}`} />
              {!isNavCollapsed && <span className={`group-hover:text-white transition-colors text-sm ${activePage === 'briefs' ? 'text-primary-teal' : 'text-light-gray-text'}`}>Briefs</span>}
            </button>
            <button onClick={handleViewAllTasks} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''} ${activePage === 'follow-ups' ? 'text-primary-teal' : ''}`}>
              <CheckSquare className={`w-4 h-4 group-hover:scale-110 transition-all ${activePage === 'follow-ups' ? 'text-primary-teal' : 'text-light-gray-text group-hover:text-primary-teal'}`} />
              {!isNavCollapsed && <span className={`group-hover:text-white transition-colors text-sm ${activePage === 'follow-ups' ? 'text-primary-teal' : 'text-light-gray-text'}`}>Follow-ups</span>}
            </button>
            <button onClick={handleViewAllMeetings} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''} ${activePage === 'meetings' ? 'text-primary-teal' : ''}`}>
              <Calendar className={`w-4 h-4 group-hover:scale-110 transition-all ${activePage === 'meetings' ? 'text-primary-teal' : 'text-light-gray-text group-hover:text-primary-teal'}`} />
              {!isNavCollapsed && <span className={`group-hover:text-white transition-colors text-sm ${activePage === 'meetings' ? 'text-primary-teal' : 'text-light-gray-text'}`}>Meetings</span>}
            </button>
            <button onClick={handleAllSettingsClick} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''} ${activePage === 'settings' ? 'text-primary-teal' : ''}`}>
              <Cog className={`w-4 h-4 group-hover:scale-110 transition-all ${activePage === 'settings' ? 'text-primary-teal' : 'text-light-gray-text group-hover:text-primary-teal'}`} />
              {!isNavCollapsed && <span className={`group-hover:text-white transition-colors text-sm ${activePage === 'settings' ? 'text-primary-teal' : 'text-light-gray-text'}`}>Settings</span>}
            </button>
          </div>

          {/* Brief Me Teams Card */}
          {!isNavCollapsed && (
            <div className="rounded-lg p-3 bg-surface-overlay/30 shadow-sm relative overflow-hidden">
              {/* Enhanced blurred background mockups */}
              <div className="absolute inset-0 opacity-20 blur-[1px] pointer-events-none">
                <div className="grid grid-cols-1 gap-2 h-full p-2">
                  {/* Team card mockup */}
                  <div className="bg-gradient-to-br from-accent-primary/50 to-accent-primary/70 rounded-lg p-2 shadow-lg">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex -space-x-1">
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white/40 rounded h-1.5 w-full"></div>
                      <div className="bg-white/35 rounded h-1.5 w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Clear content with better contrast */}
              <div className="relative z-10 bg-surface-overlay/70 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Brief Me Teams
                </h3>
                
                <p className="text-text-secondary text-xs mb-3">Coming soon...</p>
                
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">AI meeting proxy</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">Team brief summaries</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">Cross-team insights</p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs h-8 bg-white/10 border-white/20 text-text-primary hover:bg-white/20 hover:text-white"
                >
                  Join Waitlist
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-surface overflow-hidden">
        {/* Hamburger Menu - show whenever nav is collapsed */}
        {isNavCollapsed && (
          <div className="p-4">
            <button
              onClick={handleToggleNav}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        )}
        
        {/* Page Content */}
        <div className="flex-1 px-6 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Main Content Container with consistent styling */}
            <div className="col-span-3 card-dark p-6" style={{
              background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)'
            }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;