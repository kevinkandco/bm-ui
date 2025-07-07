import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Settings, MoreHorizontal, ThumbsUp, ThumbsDown, Rss, Shield, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Mock data - in a real app this would be fetched based on briefId
  const briefData = {
    id: briefId,
    title: "Daily Combined Brief",
    start: "5:00 AM",
    end: "8:00 AM",
    nextBriefTime: "2:00 PM",
    metrics: {
      interruptsPrevented: 23,
      focusGained: { hours: 2, minutes: 35 },
      followUps: 7
    },
    audioUrl: "/path/to/audio.mp3",
    audioDuration: "3:00"
  };

  const badgeTypes = [
    { type: "critical", label: "Critical", color: "#dc2626", emoji: "🔴" },
    { type: "decision", label: "Decision", color: "#1d4ed8", emoji: "🔵" },
    { type: "approval", label: "Approval", color: "#f59e0b", emoji: "🟠" },
    { type: "headsup", label: "Heads-Up", color: "#6b7280", emoji: "⚫" }
  ];

  const followUps = [
    {
      id: 1,
      badge: "critical",
      title: "Review launch materials for marketing team",
      summary: "Marketing team needs approval by 2 PM today to stay on track with product launch timeline",
      source: "gmail",
      sender: "Sarah Johnson"
    },
    {
      id: 2,
      badge: "approval",
      title: "Approve Q4 budget allocations for finance team",
      summary: "Finance team needs approval to proceed with quarterly planning",
      source: "gmail",
      sender: "Finance Team"
    },
    {
      id: 3,
      badge: "decision",
      title: "Respond to testing phase timeline concerns",
      summary: "Sarah raised concerns about extending testing phase by a week for quality assurance",
      source: "slack",
      sender: "Sarah Johnson"
    },
    {
      id: 4,
      badge: "headsup",
      title: "Schedule follow-up meeting with product team",
      summary: "Team wants to discuss roadmap updates next week",
      source: "slack",
      sender: "Product Team"
    },
    {
      id: 5,
      badge: "critical",
      title: "Server performance issues in production",
      summary: "DevOps team reporting 30% increase in response times since yesterday",
      source: "slack",
      sender: "DevOps Team"
    },
    {
      id: 6,
      badge: "decision",
      title: "Choose vendor for new authentication system",
      summary: "Security team has narrowed down to two options, need final decision by Friday",
      source: "gmail", 
      sender: "Security Team"
    },
    {
      id: 7,
      badge: "approval",
      title: "Sign off on new hiring plan",
      summary: "HR needs approval for 5 new engineering positions for Q1",
      source: "gmail",
      sender: "HR Team"
    }
  ];

  // Filter follow-ups based on active filter
  const filteredFollowUps = activeFilter 
    ? followUps.filter(item => item.badge === activeFilter)
    : followUps;

  // Sort by urgency (critical first), then by badge weight, then newest
  const sortedFollowUps = [...filteredFollowUps].sort((a, b) => {
    const badgeWeights = { critical: 0, decision: 1, approval: 2, headsup: 3 };
    const aWeight = badgeWeights[a.badge as keyof typeof badgeWeights];
    const bWeight = badgeWeights[b.badge as keyof typeof badgeWeights];
    return aWeight - bWeight;
  });

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Audio Paused" : "Playing Audio Brief",
      description: isPlaying ? "Audio brief paused" : "Starting audio playback"
    });
  };

  const handleFeedback = (type: 'up' | 'down') => {
    toast({
      title: "Feedback Received",
      description: `Thank you for your ${type === 'up' ? 'positive' : 'constructive'} feedback!`
    });
  };

  const handleFilterClick = (badgeType: string) => {
    setActiveFilter(activeFilter === badgeType ? null : badgeType);
  };

  const getBadgeConfig = (badgeType: string) => {
    return badgeTypes.find(b => b.type === badgeType) || badgeTypes[3];
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "gmail": return <Mail className="h-4 w-4 text-red-400" />;
      case "slack": return <MessageSquare className="h-4 w-4 text-purple-400" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout 
      currentPage="briefs" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="min-h-screen bg-surface px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Brief-me Logo */}
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-[140px] h-12 bg-accent-primary/10 rounded-lg border border-accent-primary/20">
              <span className="text-accent-primary font-semibold text-lg">Brief.me</span>
            </div>
          </div>
          
          {/* Title and Range */}
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{briefData.title}</h1>
          <Badge variant="secondary" className="bg-surface-raised/50 text-text-secondary">
            {briefData.start} → {briefData.end}
          </Badge>
        </div>

        {/* Metrics Strip */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center">
            {/* Interrupts Prevented */}
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent-primary" />
              <span className="text-text-secondary text-sm">Interrupts Prevented</span>
              <Badge variant="secondary" className="bg-accent-primary/10 text-accent-primary">
                {briefData.metrics.interruptsPrevented}
              </Badge>
            </div>
            
            {/* Focus Gained */}
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent-primary" />
              <span className="text-text-secondary text-sm">Focus Gained</span>
              <Badge variant="secondary" className="bg-accent-primary/10 text-accent-primary">
                {briefData.metrics.focusGained.hours}h {briefData.metrics.focusGained.minutes}m
              </Badge>
            </div>
            
            {/* Follow-ups */}
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent-primary" />
              <span className="text-text-secondary text-sm">Follow-ups</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1 h-auto text-accent-primary hover:text-accent-primary/80"
                onClick={() => document.getElementById('followups-table')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {briefData.metrics.followUps}
              </Button>
            </div>
          </div>
        </div>

        {/* Audio Card */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          {/* Waveform - centered with reduced height */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-2xl h-12 bg-surface/60 rounded-lg flex items-end px-4 relative overflow-hidden">
              <div className="flex items-end gap-[2px] h-full w-full justify-center">
                {Array.from({ length: 80 }).map((_, i) => {
                  const height = Math.random() * 0.8 + 0.2;
                  const isActive = i < 20; // Simulate progress
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-accent-primary shadow-[0_0_8px_rgba(46,226,173,0.6)]' 
                          : 'bg-white/20'
                      }`}
                      style={{ height: `${height * 100}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Centered Controls */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={handlePlayPause}
                className="w-14 h-14 rounded-full bg-accent-primary hover:bg-accent-primary/80 text-white"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
              </Button>
              <span className="text-sm text-text-secondary">{briefData.audioDuration}</span>
            </div>
          </div>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-accent-primary hover:bg-accent-primary/80 text-white">
              Listen to Brief
            </Button>
            <Button variant="outline" className="border-white/20 hover:border-accent-primary hover:text-accent-primary">
              <Rss className="h-4 w-4 mr-2" />
              Subscribe to your brief podcast
            </Button>
          </div>
        </div>

        {/* Follow-ups Table */}
        <div id="followups-table" className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 sm:mb-0">Follow-ups</h2>
            
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {badgeTypes.map((badge) => (
                <Button
                  key={badge.type}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFilterClick(badge.type)}
                  className={`text-xs h-7 px-3 ${
                    activeFilter === badge.type 
                      ? 'bg-white/10 text-text-primary' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  {badge.emoji} {badge.label}
                </Button>
              ))}
              {activeFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter(null)}
                  className="text-xs h-7 px-2 text-text-secondary hover:text-text-primary"
                >
                  <Filter className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="border border-border-subtle rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border-subtle hover:bg-transparent">
                  <TableHead className="text-text-secondary text-xs font-medium h-10">Badge</TableHead>
                  <TableHead className="text-text-secondary text-xs font-medium">Title & Summary</TableHead>
                  <TableHead className="text-text-secondary text-xs font-medium w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedFollowUps.map((item) => {
                  const badgeConfig = getBadgeConfig(item.badge);
                  return (
                    <TableRow 
                      key={item.id} 
                      className="border-b border-border-subtle/50 hover:bg-white/5 transition-colors"
                      style={{ height: '60px' }}
                    >
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: badgeConfig.color }}
                          />
                          <span className="text-xs text-text-secondary">{badgeConfig.label}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getSourceIcon(item.source)}
                            <span className="text-sm font-medium text-text-primary line-clamp-1">
                              {item.title}
                            </span>
                          </div>
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-surface-raised border-white/20">
                            <DropdownMenuItem className="hover:bg-white/10">
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10">
                              Mark as Done
                            </DropdownMenuItem>
                            <DropdownMenuItem className="hover:bg-white/10">
                              Snooze
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Upcoming Brief Card */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Upcoming Brief</h3>
          <p className="text-text-secondary mb-4">
            Next brief at {briefData.nextBriefTime}.
          </p>
          <Button 
            variant="outline" 
            className="border-white/20 hover:border-accent-primary hover:text-accent-primary"
            onClick={() => window.open('https://hey.brief-me.app/dashboard/settings', '_blank')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Adjust your brief settings
          </Button>
        </div>

        {/* Feedback Widget - Fixed to bottom-left */}
        <div className="fixed bottom-6 left-6 z-50">
          <div className="glass-card rounded-xl p-4 bg-surface-raised/90 backdrop-blur-md border border-white/20">
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">Help Brief.me learn</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-400"
                  onClick={() => handleFeedback('up')}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-400"
                  onClick={() => handleFeedback('down')}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BriefDetail;