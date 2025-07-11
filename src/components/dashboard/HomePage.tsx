import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, ChevronRight, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface HomePageProps {
  onOpenBrief?: (briefId: number) => void;
  onViewTranscript?: (briefId: number) => void;
  onToggleFocusMode?: () => void;
  onToggleCatchMeUp?: () => void;
  onOpenBriefModal?: () => void;
  onStartFocusMode?: () => void;
  onSignOffForDay?: () => void;
}

export default function HomePage({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay
}: HomePageProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Mock data and state
  const [briefItems] = useState([
    {
      id: 1,
      title: "Q4 Planning & Roadmap",
      status: "new" as const,
      urgent: false,
      timestamp: "2 mins ago",
      highlights: [
        "Q4 OKRs finalized with 15% revenue growth target",
        "New product feature roadmap approved",
        "Engineering team scaling up by 3 developers"
      ]
    },
    {
      id: 2,
      title: "Client Onboarding Updates",
      status: "read" as const,
      urgent: true,
      timestamp: "15 mins ago",
      highlights: [
        "3 new enterprise clients signed this week",
        "Onboarding process streamlined to 5 days",
        "Customer success team expanded"
      ]
    }
  ]);

  const [actionItems] = useState([
    {
      id: 1,
      title: "Review contract with Acme Corp",
      urgent: true,
      dueTime: "2:00 PM today",
      source: "Slack - #legal"
    },
    {
      id: 2,
      title: "Approve Q4 budget proposal",
      urgent: false,
      dueTime: "Tomorrow",
      source: "Email - finance@company.com"
    },
    {
      id: 3,
      title: "Schedule team retrospective",
      urgent: false,
      dueTime: "This week",
      source: "Calendar reminder"
    }
  ]);

  const [priorityPeople] = useState([
    {
      id: 1,
      name: "Sarah Chen",
      role: "Head of Product",
      avatar: "/placeholder.svg",
      lastInteraction: "2 hours ago",
      urgentCount: 2
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Engineering Lead",
      avatar: "/placeholder.svg",
      lastInteraction: "30 mins ago",
      urgentCount: 1
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Customer Success",
      avatar: "/placeholder.svg",
      lastInteraction: "1 hour ago",
      urgentCount: 0
    }
  ]);

  const [meetings] = useState([
    {
      id: 1,
      title: "Weekly Leadership Sync",
      time: "2:00 PM - 3:00 PM",
      attendees: ["Sarah Chen", "Marcus Johnson", "Emily Rodriguez"],
      location: "Conference Room A",
      status: "upcoming" as const
    },
    {
      id: 2,
      title: "Product Demo - Acme Corp",
      time: "3:30 PM - 4:30 PM",
      attendees: ["John Smith (Acme)", "Sarah Chen"],
      location: "Zoom",
      status: "upcoming" as const
    }
  ]);

  const handleViewAllBriefs = useCallback(() => {
    toast({
      title: "Briefs",
      description: "Navigating to all briefs",
    });
  }, [toast]);

  const handleViewAllTasks = useCallback(() => {
    toast({
      title: "Action Items",
      description: "Navigating to all action items",
    });
  }, [toast]);

  const handleViewAllMeetings = useCallback(() => {
    toast({
      title: "Meetings",
      description: "Navigating to all meetings",
    });
  }, [toast]);

  const getBriefStatusColor = (status: string, urgent: boolean) => {
    if (urgent) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (status === "new") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getBriefStatusText = (status: string, urgent: boolean) => {
    if (urgent) return "urgent";
    return status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Good morning, Alex</h1>
          <p className="text-light-gray-text">Here's what needs your attention today</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={onToggleCatchMeUp}
            variant="outline" 
            className="border-primary-teal/20 text-primary-teal hover:bg-primary-teal/10"
          >
            <Network className="w-4 h-4 mr-2" />
            Catch me up
          </Button>
          <Button 
            onClick={onStartFocusMode}
            className="bg-primary-teal hover:bg-primary-teal/80 text-white"
          >
            <Focus className="w-4 h-4 mr-2" />
            Focus mode
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-dark border-border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-teal/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary-teal" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{briefItems.length}</p>
                <p className="text-sm text-light-gray-text">New briefs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark border-border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <CheckSquare className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{actionItems.filter(item => item.urgent).length}</p>
                <p className="text-sm text-light-gray-text">Urgent actions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-dark border-border-muted">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{meetings.length}</p>
                <p className="text-sm text-light-gray-text">Meetings today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Briefs */}
        <Card className="card-dark border-border-muted">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Latest Briefs</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewAllBriefs}
                className="text-primary-teal hover:text-primary-teal hover:bg-primary-teal/10"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {briefItems.map((brief) => (
              <div
                key={brief.id}
                className="p-4 rounded-lg border border-border-muted bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors cursor-pointer"
                onClick={() => onOpenBrief?.(brief.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-white">{brief.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getBriefStatusColor(brief.status, brief.urgent)}>
                      {getBriefStatusText(brief.status, brief.urgent)}
                    </Badge>
                    <span className="text-xs text-light-gray-text">{brief.timestamp}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {brief.highlights.slice(0, 2).map((highlight, index) => (
                    <p key={index} className="text-sm text-light-gray-text">• {highlight}</p>
                  ))}
                  {brief.highlights.length > 2 && (
                    <p className="text-xs text-primary-teal cursor-pointer hover:underline">
                      +{brief.highlights.length - 2} more highlights
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card className="card-dark border-border-muted">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Action Items</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewAllTasks}
                className="text-primary-teal hover:text-primary-teal hover:bg-primary-teal/10"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {actionItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-border-muted bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{item.title}</h4>
                  {item.urgent && (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                      urgent
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-light-gray-text">{item.source}</span>
                  <span className={`font-medium ${item.urgent ? 'text-red-400' : 'text-light-gray-text'}`}>
                    {item.dueTime}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Priority People */}
        <Card className="card-dark border-border-muted">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white">Priority People</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {priorityPeople.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 rounded-lg border border-border-muted bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors cursor-pointer"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={person.avatar} />
                  <AvatarFallback className="bg-primary-teal/20 text-primary-teal text-sm">
                    {person.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white text-sm">{person.name}</h4>
                    {person.urgentCount > 0 && (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                        {person.urgentCount} urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-light-gray-text">{person.role}</p>
                    <p className="text-xs text-light-gray-text">{person.lastInteraction}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Today's Meetings */}
        <Card className="card-dark border-border-muted">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-white">Today's Meetings</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewAllMeetings}
                className="text-primary-teal hover:text-primary-teal hover:bg-primary-teal/10"
              >
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="p-3 rounded-lg border border-border-muted bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-white text-sm">{meeting.title}</h4>
                  <span className="text-xs text-light-gray-text">{meeting.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-light-gray-text">
                    {meeting.attendees.slice(0, 2).join(', ')}
                    {meeting.attendees.length > 2 && ` +${meeting.attendees.length - 2} more`}
                  </p>
                  <p className="text-xs text-light-gray-text">{meeting.location}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
