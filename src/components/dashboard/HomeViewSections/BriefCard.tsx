
import React, { useState } from "react";
import { Clock, ChevronRight, User, Calendar, MapPin, MessageSquare, CheckSquare, ExternalLink, MoreVertical, Zap, ChevronDown, BarChart3, Target, AlertCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
      autoAddedToTaskManager?: string;
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
  const [isOpen, setIsOpen] = useState(false);

  const handleActionItemFeedback = (itemId: string, relevant: boolean, feedback?: string) => {
    handleActionRelevance(brief.id, itemId, relevant, feedback);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-collapsible-trigger]')) {
      return;
    }
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

  // Calculate stats
  const totalMessages = 81;
  const slackMessages = 8;
  const emails = 73;
  const lowPriorityActions = brief.actionItems.filter(item => item.priority === "low").length;
  const mediumPriorityActions = brief.actionItems.filter(item => item.priority === "medium").length;
  const highPriorityActions = brief.actionItems.filter(item => item.priority === "high").length;
  const totalActionItems = brief.actionItems.length;

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer border-border-subtle">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-6">
          {/* Closed State - matches image design */}
          {!isOpen && (
            <div className="flex items-center justify-between" onClick={handleCardClick}>
              {/* Left side with play icon and content */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#458888] to-[#50A181] flex items-center justify-center">
                  <Play className="h-5 w-5 text-white ml-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{brief.title}</h3>
                  <p className="text-sm text-text-secondary">
                    Delivered at {brief.timestamp} (Summarizing: 11:07 PM - 9:00 AM)
                  </p>
                  <p className="text-sm text-text-secondary mt-1">{brief.summary}</p>
                </div>
              </div>

              {/* Right side with stats and chevron */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4 text-sm text-text-secondary">
                  <span>{slackMessages} Slack</span>
                  <span>{emails} Emails</span>
                  <span>{totalActionItems} Actions</span>
                </div>
                <div className="text-green-400 text-sm font-medium">~33min saved</div>
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto"
                    data-collapsible-trigger
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronDown className="h-5 w-5 text-text-secondary" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>
          )}

          {/* Open State */}
          {isOpen && (
            <>
              {/* Header Section when open */}
              <div className="flex items-start justify-between mb-4" onClick={handleCardClick}>
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#458888] to-[#50A181] flex items-center justify-center mt-1">
                    <Play className="h-5 w-5 text-white ml-0.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-text-primary truncate">{brief.title}</h3>
                      <Badge variant="secondary" className={`${getPriorityColor(brief.priority)} text-xs px-2 py-1`}>
                        {brief.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">
                      Delivered at {brief.timestamp} (Summarizing: 11:07 PM - 9:00 AM)
                    </p>
                    <p className="text-sm text-text-secondary">{brief.summary}</p>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary mt-2">
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
                <CollapsibleTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto"
                    data-collapsible-trigger
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ChevronDown className="h-5 w-5 text-text-secondary transition-transform duration-200 transform rotate-180" />
                  </Button>
                </CollapsibleTrigger>
              </div>

              {/* Stats Section when open */}
              <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400 font-medium">Time saved: ~25min reading + 8min processing = 33min total</span>
                </div>
              </div>

              {/* Quick Stats Grid when open */}
              <div className="grid grid-cols-5 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <BarChart3 className="h-4 w-4 text-accent-primary" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{totalMessages}</div>
                  <div className="text-xs text-text-secondary">Total Messages<br />Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <CheckSquare className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{lowPriorityActions}</div>
                  <div className="text-xs text-text-secondary">Low Priority</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <AlertCircle className="h-4 w-4 text-yellow-400" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{mediumPriorityActions}</div>
                  <div className="text-xs text-text-secondary">Medium Priority</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{highPriorityActions}</div>
                  <div className="text-xs text-text-secondary">High Priority</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Target className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-lg font-semibold text-text-primary">{totalActionItems}</div>
                  <div className="text-xs text-text-secondary">Action Items</div>
                </div>
              </div>

              {/* Top stats when open */}
              <div className="flex items-center justify-between mb-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-4">
                  <span>{slackMessages} Slack</span>
                  <span>{emails} Emails</span>
                  <span>{totalActionItems} Actions</span>
                </div>
                <div className="text-green-400">~33min saved</div>
              </div>

              {/* Action Items when open */}
              {brief.actionItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-text-primary">Action Items:</h4>
                  <div className="space-y-2">
                    {brief.actionItems.map((item) => (
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
                </div>
              )}

              {/* Channels when open */}
              {brief.channels.length > 0 && (
                <div className="pt-4 border-t border-border-subtle">
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
            </>
          )}
        </CardContent>
      </Collapsible>
    </Card>
  );
};

export default BriefCard;
