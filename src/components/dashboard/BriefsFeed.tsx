
import React, { useMemo } from "react";
import { Headphones, Zap, Archive, MessageSquare, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BriefsFeedProps {
  onOpenBrief: (briefId: number) => void;
  onCatchMeUp: () => void;
  onFocusMode: () => void;
}

const BriefsFeed = React.memo(({ onOpenBrief, onCatchMeUp, onFocusMode }: BriefsFeedProps) => {
  // Sample briefs data - in a real app this would come from a data source
  const briefs = useMemo(() => [
    {
      id: 1,
      title: "Morning Brief",
      description: "Quick summary of your morning updates",
      timestamp: "Today, 8:00 AM",
      stats: {
        emails: 5,
        messages: 12,
        meetings: 1
      }
    },
    {
      id: 2,
      title: "Slack Channel Updates",
      description: "New messages in #team-updates channel",
      timestamp: "Today, 10:30 AM",
      stats: {
        emails: 0,
        messages: 8,
        meetings: 0
      }
    },
    {
      id: 3,
      title: "Weekly Summary",
      description: "Your week at a glance",
      timestamp: "Yesterday, 5:00 PM",
      stats: {
        emails: 24,
        messages: 47,
        meetings: 5
      }
    },
    {
      id: 4,
      title: "Project Deadline Reminders",
      description: "Upcoming project milestones this week",
      timestamp: "2 days ago",
      stats: {
        emails: 2,
        messages: 5,
        meetings: 2
      }
    }
  ], []);

  const handleOpenBrief = (briefId: number) => {
    onOpenBrief(briefId);
  };

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-3 mb-2">
        <Button 
          onClick={onCatchMeUp}
          className="rounded-full shadow-subtle hover:shadow-glow transition-all bg-accent-primary text-white"
        >
          <Zap className="mr-2 h-5 w-5" /> Catch Me Up
        </Button>
        <Button 
          onClick={onFocusMode}
          variant="outline"
          className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
        >
          <Headphones className="mr-2 h-5 w-5" /> Focus Mode
        </Button>
      </div>
      
      <Card className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border-subtle">
          <h2 className="text-xl font-semibold text-text-primary">Your Brief Feed</h2>
          <p className="text-text-secondary mt-1">Stay updated with your latest briefs</p>
        </div>
        
        {briefs.map((brief, index) => (
          <React.Fragment key={brief.id}>
            <div 
              className="p-6 hover:bg-surface-raised/30 transition-colors cursor-pointer" 
              onClick={() => handleOpenBrief(brief.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-text-primary text-lg font-medium">{brief.title}</h3>
                <span className="text-sm text-text-secondary">{brief.timestamp}</span>
              </div>
              <p className="text-text-secondary mb-4 text-sm">{brief.description}</p>
              <div className="flex flex-wrap gap-4 items-center">
                {brief.stats.emails > 0 && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">{brief.stats.emails} emails</span>
                  </div>
                )}
                
                {brief.stats.messages > 0 && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">{brief.stats.messages} messages</span>
                  </div>
                )}
                
                {brief.stats.meetings > 0 && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent-primary" />
                    <span className="text-sm font-medium text-text-primary">{brief.stats.meetings} meetings</span>
                  </div>
                )}
                
                <Button variant="outline" size="sm" className="ml-auto border-border-subtle text-text-primary hover:bg-surface-raised/30 hover:text-accent-primary shadow-subtle">
                  View Full Brief
                </Button>
              </div>
            </div>
            {index < briefs.length - 1 && <Separator className="bg-border-subtle" />}
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
});

BriefsFeed.displayName = 'BriefsFeed';
export default BriefsFeed;
