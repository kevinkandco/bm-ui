import React, { useState, useCallback } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check, Star, X, ArrowUpRight, PanelRightClose, Calendar, AlertTriangle, Clock, User, Tag, Play, Pause } from 'lucide-react';
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
}

const ActionItemsPanel = ({
  className,
  onToggleCollapse,
  selectedMessage,
  onCloseMessage,
  selectedTranscript,
  onCloseTranscript
}: ActionItemsPanelProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Sample action items data matching the wireframe
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Review finances',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Deadline',
      completed: false
    },
    {
      id: '2',
      title: 'Schedule follow up with Mike',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Action',
      completed: false
    },
    {
      id: '3',
      title: 'Decide on new logo',
      source: 'gmail',
      sender: 'Sara Chen',
      tag: 'Decision',
      completed: false
    },
    {
      id: '4',
      title: 'Respond to confirm funding',
      source: 'slack',
      sender: 'Sara Chen',
      tag: 'Decision',
      completed: false
    }
  ]);

  // Filter and sort action items
  const openItems = actionItems.filter(item => !item.completed);
  const openCount = openItems.length;

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
          <div className="border border-border-subtle/20 rounded-2xl shadow-sm p-4 mx-4">
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
            <div className="bg-black/5 rounded-lg p-4 border border-border-subtle/20">
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
              <div className="bg-black/5 rounded-lg p-3 border border-border-subtle/20">
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
            <div className="bg-black/5 rounded-lg p-4 border border-border-subtle/20">
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
        <div className={cn("border border-border-subtle/20 rounded-2xl shadow-sm mx-4 mb-4")}>
          {/* Action Items List */}
          <div className="p-4">
            <div className="space-y-3">
              {openItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  {/* Source Icon */}
                  <div className="flex-shrink-0">
                    {getSourceIcon(item.source)}
                  </div>

                  {/* Checkbox */}
                  <Checkbox 
                    checked={item.completed}
                    onCheckedChange={() => handleMarkDone(item.id)}
                    className="flex-shrink-0"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-secondary">
                      from {item.sender}
                    </p>
                  </div>

                  {/* Tag */}
                  <div className="flex-shrink-0">
                    <span className="text-xs text-text-secondary">
                      {item.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItemsPanel;