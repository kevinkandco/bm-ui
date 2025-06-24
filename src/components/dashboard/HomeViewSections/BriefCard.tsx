import React, { useState } from "react";
import { Clock, ChevronRight, User, Calendar, MapPin, MessageSquare, CheckSquare, ExternalLink, MoreVertical, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import ActionItemFeedback from "../ActionItemFeedback";
import { useFeedbackTracking } from "../useFeedbackTracking";

interface BriefCardProps {
  brief: {
    id: string;
    title: string;
    summary: string;
    timestamp: string;
    priority: "high" | "medium" | "low";
    actionItems: Array<{
      id: string;
      text: string;
      source: string;
      priority: "high" | "medium" | "low";
      autoAddedToTaskManager?: string; // e.g., "Asana", "Todoist"
    }>;
    channels: string[];
    peopleCount: number;
    location?: string;
    type: "meeting" | "email" | "document" | "general";
  };
  viewMode?: "summary" | "detailed";
}

const BriefCard = ({ brief, viewMode = "summary" }: BriefCardProps) => {
  const navigate = useNavigate();
  const { handleActionRelevance } = useFeedbackTracking();

  const handleActionItemFeedback = (itemId: string, relevant: boolean, feedback?: string) => {
    handleActionRelevance(brief.id, itemId, relevant, feedback);
  };

  const handleCardClick = () => {
    navigate(`/dashboard/briefs/${brief.id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-500/20";
      case "medium": return "text-yellow-400 bg-yellow-500/20";
      case "low": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getTypeIcon = () => {
    switch (brief.type) {
      case "meeting": return <Calendar className="h-4 w-4" />;
      case "email": return <MessageSquare className="h-4 w-4" />;
      case "document": return <CheckSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer border-border-subtle" onClick={handleCardClick}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-white/10 rounded-lg mt-1">
              {getTypeIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-text-primary truncate">{brief.title}</h3>
                <Badge variant="secondary" className={`${getPriorityColor(brief.priority)} text-xs px-2 py-1`}>
                  {brief.priority}
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mb-2">{brief.summary}</p>
              <div className="flex items-center space-x-4 text-xs text-text-secondary">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{brief.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3" />
                  <span>{brief.peopleCount} people</span>
                </div>
                {brief.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{brief.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-accent-primary transition-colors" />
        </div>

        {/* Action Items */}
        {brief.actionItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">Action Items:</h4>
            <div className="space-y-2">
              {brief.actionItems.slice(0, viewMode === "summary" ? 2 : undefined).map((item) => (
                <div key={item.id} className="flex items-start justify-between p-3 bg-white/5 rounded-lg group/item">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckSquare className="h-4 w-4 text-accent-primary" />
                      <span className="text-sm text-text-primary">{item.text}</span>
                      {item.autoAddedToTaskManager && (
                        <div className="flex items-center space-x-1 ml-2">
                          <Zap className="h-3 w-3 text-yellow-400" />
                          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-400">
                            Auto-added to {item.autoAddedToTaskManager}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span>From: {item.source}</span>
                      <Badge variant="secondary" className={`${getPriorityColor(item.priority)} text-xs`}>
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                  <ActionItemFeedback
                    itemId={item.id}
                    onRelevanceFeedback={handleActionItemFeedback}
                  />
                </div>
              ))}
            </div>
            {brief.actionItems.length > 2 && viewMode === "summary" && (
              <p className="text-xs text-text-secondary">
                +{brief.actionItems.length - 2} more action items
              </p>
            )}
          </div>
        )}

        {brief.channels.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-text-secondary">Channels:</span>
              <div className="flex flex-wrap gap-1">
                {brief.channels.slice(0, 3).map((channel, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {channel}
                  </Badge>
                ))}
                {brief.channels.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{brief.channels.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BriefCard;
