import React, { useState, useCallback } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check, Star, X, ArrowUpRight, PanelRightClose, Calendar, AlertTriangle, Clock, User, Tag, Play, Pause, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import ActionItemModal from './ActionItemModal';

interface ActionItem {
  id: string;
  title: string;
  source: 'slack' | 'gmail';
  sender: string;
  tag: 'Deadline' | 'Action' | 'Decision';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface ActionItemsPanelProps {
  className?: string;
  onViewAll?: () => void;
  onToggleCollapse?: () => void;
  selectedMessage?: any;
  onCloseMessage?: () => void;
  selectedTranscript?: any;
  onCloseTranscript?: () => void;
  selectedFollowUp?: any;
  onCloseFollowUp?: () => void;
}

const ActionItemsPanel = ({
  className,
  onToggleCollapse,
  selectedMessage,
  onCloseMessage,
  selectedTranscript,
  onCloseTranscript,
  selectedFollowUp,
  onCloseFollowUp
}: ActionItemsPanelProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const [showAllPriorities, setShowAllPriorities] = useState(false);

  // Sample action items data matching the wireframe
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Review finances',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Deadline',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'Schedule follow up with Mike',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Action',
      priority: 'high',
      completed: false
    },
    {
      id: '3',
      title: 'Decide on new logo',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Decision',
      priority: 'medium',
      completed: false
    },
    {
      id: '4',
      title: 'Respond to confirm funding',
      source: 'slack',
      sender: 'Sara Chen',
      tag: 'Decision',
      priority: 'medium',
      completed: false
    },
    {
      id: '5',
      title: 'Update project timeline',
      source: 'slack',
      sender: 'John Doe',
      tag: 'Action',
      priority: 'low',
      completed: false
    },
    {
      id: '6',
      title: 'Plan team meeting',
      source: 'gmail',
      sender: 'Jane Smith',
      tag: 'Action',
      priority: 'low',
      completed: false
    }
  ]);

  // Filter and sort action items by priority
  const openItems = actionItems.filter(item => !item.completed);
  const openCount = openItems.length;
  
  // Group by priority
  const highItems = openItems.filter(item => item.priority === 'high');
  const mediumItems = openItems.filter(item => item.priority === 'medium');
  const lowItems = openItems.filter(item => item.priority === 'low');
  
  // Show high + medium by default, with max 5 items total
  const visibleItems = showAllPriorities 
    ? openItems 
    : [...highItems, ...mediumItems].slice(0, 5);
  
  const hasLowPriorityItems = lowItems.length > 0;
  const shouldShowExpandOption = !showAllPriorities && hasLowPriorityItems;

  const handleItemClick = useCallback((item: ActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleMarkDone = useCallback((itemId: string) => {
    const item = actionItems.find(i => i.id === itemId);
    setActionItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  }, [actionItems]);

  const handleMarkAllDone = useCallback(() => {
    setActionItems(prev => prev.map(item => ({ ...item, completed: true })));
    toast({
      title: "All Items Completed",
      description: "All action items marked as done"
    });
  }, [toast]);

  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? <Slack className="w-4 h-4" /> : <Mail className="w-4 h-4" />;
  };

  // Empty state - collapsed single line
  if (openCount === 0) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="p-4 pb-3 mt-[30px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-primary">Follow-ups</h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
                View all
                <ArrowUpRight className="w-4 h-4" />
              </button>
              {onToggleCollapse && (
                <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center">
          <div className="border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm p-4 mx-4">
            <div className="flex items-center justify-center text-text-secondary">
              <span className="text-sm">All clear ✅</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If a message is selected, show message details instead
  if (selectedMessage) {
    const platformIcon = selectedMessage.platform === 'S' ? Calendar : Mail;
    const platformName = selectedMessage.platform === 'S' ? 'Slack' : 'Email';
    const platformColor = selectedMessage.platform === 'S' ? 'text-purple-400' : 'text-blue-400';

    return (
      <div className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="p-4 pb-3 mt-[30px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-primary">Message Details</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseMessage}
                className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
              {onToggleCollapse && (
                <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Platform and Priority */}
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-transparent">
                <div className="flex items-center gap-1">
                  {React.createElement(platformIcon, { className: `h-3 w-3 ${platformColor}` })}
                  {platformName}
                </div>
              </Badge>
              <Badge 
                variant="outline" 
                className={`bg-transparent ${
                  selectedMessage.priority === "High" 
                    ? "border-orange-500 text-orange-400" 
                    : selectedMessage.priority === "Medium"
                    ? "border-yellow-500 text-yellow-400"
                    : "border-green-500 text-green-400"
                }`}
              >
                {selectedMessage.priority} Priority
              </Badge>
            </div>

            {/* Subject/Title */}
            <div>
              <h3 className="text-base font-medium text-text-primary mb-1">
                {selectedMessage.subject || 'Upcoming Automatic Deposit'}
              </h3>
              <p className="text-sm text-text-secondary">
                From: {selectedMessage.from || selectedMessage.sender}
              </p>
              <p className="text-sm text-text-secondary">
                Time: {selectedMessage.time}
              </p>
            </div>

            {/* Message Content */}
            <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
              <h4 className="text-sm font-medium text-text-primary mb-2">Full Message:</h4>
              <div className="text-sm text-text-primary whitespace-pre-line leading-relaxed">
                {selectedMessage.fullMessage}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3">
              {selectedMessage.relevancy && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-text-primary">Relevancy</p>
                    <p className="text-xs text-text-secondary">{selectedMessage.relevancy}</p>
                  </div>
                </div>
              )}

              {selectedMessage.reasoning && (
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-text-primary">AI Reasoning</p>
                    <p className="text-xs text-text-secondary">{selectedMessage.reasoning}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-text-secondary" />
                  <span className="text-text-secondary">Created: {selectedMessage.created || selectedMessage.time}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-text-secondary" />
                  <span className="text-text-secondary">Source: {selectedMessage.source || platformName}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button className="w-full" size="sm">
                Add to Asana
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Open in {platformName}
              </Button>
              <Button variant="ghost" className="w-full text-text-secondary" size="sm">
                Mark as Done
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // If a transcript is selected, show transcript instead
  if (selectedTranscript) {
    return (
      <div className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="p-4 pb-3 mt-[30px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-primary">Audio Transcript</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseTranscript}
                className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
              {onToggleCollapse && (
                <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Brief Header */}
            <div>
              <h3 className="text-base font-medium text-text-primary mb-1">
                {selectedTranscript.title}
              </h3>
              <p className="text-sm text-text-secondary">
                {selectedTranscript.timeRange}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="bg-transparent text-green-400 border-green-500">
                  <Play className="h-3 w-3 mr-1" />
                  Playing
                </Badge>
                <span className="text-xs text-text-secondary">{selectedTranscript.summary}</span>
              </div>
            </div>

            {/* Stats */}
            {selectedTranscript.stats && (
              <div className="bg-surface-raised/30 rounded-lg p-3 border border-border-subtle">
                <h4 className="text-sm font-medium text-text-primary mb-2">Focus Metrics</h4>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Interrupts prevented:</span>
                    <span className="text-text-primary font-medium">{selectedTranscript.stats.interrupts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Focus time preserved:</span>
                    <span className="text-text-primary font-medium">{selectedTranscript.stats.focusTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Time saved:</span>
                    <span className="text-text-primary font-medium">{selectedTranscript.stats.timeSaved} minutes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Transcript Content */}
            <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
              <h4 className="text-sm font-medium text-text-primary mb-3">Transcript:</h4>
              <div className="text-sm text-text-primary whitespace-pre-line leading-relaxed">
                {selectedTranscript.transcript}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button className="w-full" size="sm">
                Export Transcript
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Share Brief
              </Button>
              <Button variant="ghost" className="w-full text-text-secondary" size="sm">
                View Previous Briefs
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // If a follow-up is selected, show follow-up details instead
  if (selectedFollowUp) {
    const getSourceIcon = (platform: string) => {
      if (platform === 'G') {
        return (
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            G
          </div>
        );
      }
      return (
        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
          S
        </div>
      );
    };

    const getPriorityBadge = (priority: string) => {
      const variant = priority === 'High' ? 'destructive' : priority === 'Medium' ? 'secondary' : 'outline';
      return <Badge variant={variant}>{priority}</Badge>;
    };

    // Mock detailed data - in a real app this would come from the API
    const mockDetails = {
      title: selectedFollowUp.platform === 'G' ? "Workspace cancellation" : selectedFollowUp.message,
      timestamp: selectedFollowUp.time,
      from: selectedFollowUp.platform === 'G' ? "The Google Workspace Team" : selectedFollowUp.sender,
      subject: selectedFollowUp.platform === 'G' ? "Urgent: Launch Materials Review Needed" : selectedFollowUp.message,
      fullMessage: selectedFollowUp.platform === 'G' 
        ? "Your Google Workspace Business Starter subscription was suspended on Jul 28, 2025 and will be canceled on or after Sep 26, 2025 unless you reactivate. Sign in to the Admin console (Billing > Subscriptions) before Sep 26 to keep service; you'll receive a confirmation email within 48 hours after reactivation. Account: kevin@pathnine.co (domain: pathnine.co)."
        : "Hi team, I wanted to follow up on the project timeline we discussed yesterday. We need to finalize the design mockups by end of week to stay on track.",
      relevancy: selectedFollowUp.platform === 'G' ? "Critical – blocking marketing team progress" : "High – time-sensitive project milestone",
      actionReason: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
      created: "8/12/2025, 1:34:19 PM",
      lastActivity: "8/13/2025, 1:32:39 AM",
      source: selectedFollowUp.platform === 'G' ? "Gmail" : "Slack",
      due: "2 PM today"
    };

    const handleOpenInPlatform = () => {
      const platform = selectedFollowUp.platform === 'G' ? 'Gmail' : 'Slack';
      toast({
        description: `Opening ${platform} in new tab`
      });
    };

    const handleAddToAsana = () => {
      toast({
        description: "Added to Asana",
        variant: "default"
      });
    };

    const handleMarkDone = () => {
      toast({
        description: "Marked as done"
      });
      onCloseFollowUp?.();
    };

    return (
      <div className={cn("h-full flex flex-col", className)}>
        {/* Header */}
        <div className="p-4 pb-3 mt-[30px]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-primary">Follow-up Details</h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseFollowUp}
                className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
              {onToggleCollapse && (
                <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                  <PanelRightClose className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getSourceIcon(selectedFollowUp.platform)}
                <h3 className="text-base font-medium text-text-primary">{mockDetails.title}</h3>
              </div>
              <p className="text-sm text-text-secondary">{mockDetails.timestamp}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAddToAsana}
                className="text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add to Asana
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleOpenInPlatform}
                className="text-sm"
              >
                Open in {mockDetails.source}
                <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-text-secondary">
                <span className="font-medium">From:</span> {mockDetails.from}
              </div>
              <div className="text-sm text-text-secondary">
                <span className="font-medium">Subject:</span> {mockDetails.subject}
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              {getPriorityBadge(selectedFollowUp.priority)}
              <Badge variant="secondary">new</Badge>
            </div>

            {/* Full Message */}
            <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
              <h4 className="text-sm font-medium text-text-primary mb-3">Full Message:</h4>
              <div className="text-sm text-text-primary leading-relaxed">
                {mockDetails.fullMessage}
              </div>
            </div>

            {/* Relevancy */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Relevancy:</h4>
              <div className="text-sm text-text-secondary">
                {mockDetails.relevancy}
              </div>
            </div>

            {/* Why this is an action item */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Why this is an action item:</h4>
              <div className="text-sm text-text-secondary">
                {mockDetails.actionReason}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-3 pt-4 border-t border-border-subtle">
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-medium text-text-primary">Created:</span>
                  <span className="text-text-secondary">{mockDetails.created}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-text-primary">Last Activity:</span>
                  <span className="text-text-secondary">{mockDetails.lastActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-text-primary">Source:</span>
                  <span className="text-text-secondary capitalize">{mockDetails.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-text-primary">Due:</span>
                  <span className="text-text-secondary">{mockDetails.due}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4 border-t border-border-subtle">
              <Button 
                onClick={handleOpenInPlatform}
                className="w-full"
                variant="outline"
                size="sm"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in {mockDetails.source}
              </Button>
              <Button 
                onClick={handleMarkDone}
                className="w-full"
                size="sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark Done
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className={cn("h-full flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 pb-3 mt-[30px]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-primary">Follow-ups</h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
              View all
              <ArrowUpRight className="w-4 h-4" />
            </button>
            {onToggleCollapse && (
              <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-6 w-6 p-0">
                <PanelRightClose className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Content Container */}
      <div className="flex-1 overflow-auto">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--brand-600)] mx-4 mb-4">
          <div className="p-4 space-y-4">
            
            {/* High Priority Section */}
            {highItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium" style={{color: 'var(--text-muted)'}}>
                  HIGH PRIORITY
                </h3>
                <div className="space-y-3">
                  {highItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Checkbox 
                        checked={item.completed}
                        onCheckedChange={() => handleMarkDone(item.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-tight" style={{color: 'var(--text-secondary)'}}>
                            {item.title}
                          </p>
                          <Badge variant="high">
                            High
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {getSourceIcon(item.source)}
                            <span className="text-xs" style={{color: 'var(--text-muted)'}}>
                              from {item.sender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Section */}
            {mediumItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium" style={{color: 'var(--text-muted)'}}>
                  MEDIUM PRIORITY
                </h3>
                <div className="space-y-3">
                  {mediumItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Checkbox 
                        checked={item.completed}
                        onCheckedChange={() => handleMarkDone(item.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-tight" style={{color: 'var(--text-secondary)'}}>
                            {item.title}
                          </p>
                          <Badge variant="medium">
                            Medium
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {getSourceIcon(item.source)}
                            <span className="text-xs" style={{color: 'var(--text-muted)'}}>
                              from {item.sender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Low Priority Section - only show when expanded */}
            {showAllPriorities && lowItems.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-medium" style={{color: 'var(--text-muted)'}}>
                  LOW PRIORITY
                </h3>
                <div className="space-y-3">
                  {lowItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3">
                      <Checkbox 
                        checked={item.completed}
                        onCheckedChange={() => handleMarkDone(item.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-tight" style={{color: 'var(--text-secondary)'}}>
                            {item.title}
                          </p>
                          <Badge variant="low">
                            Low
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {getSourceIcon(item.source)}
                            <span className="text-xs" style={{color: 'var(--text-muted)'}}>
                              from {item.sender}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Show all toggle */}
            {shouldShowExpandOption && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAllPriorities(true)}
                className="w-full text-xs"
                style={{color: 'var(--text-secondary)'}}
              >
                Show all ({lowItems.length} more)
              </Button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItemsPanel;