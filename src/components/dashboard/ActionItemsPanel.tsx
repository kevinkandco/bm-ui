import React, { useState, useCallback, useEffect } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ActionItemModal from './ActionItemModal';
import { useApi } from '@/hooks/useApi';
import { ActionItem } from './types';

interface ActionItemsPanelProps {
  className?: string;
  onViewAll: () => void;
  setActionItemsCount: (count: number) => void;
}
const ActionItemsPanel = ({
  className,
  setActionItemsCount
}: Omit<ActionItemsPanelProps, 'onViewAll'>) => {
  const {
    toast
  } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);
  const { call } = useApi();

  // Sample action items data with new tagging structure
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const getActionItems = useCallback(async () => {
    const response = await call("get", `/action-items?par_page=4`, {
      showToast: true,
      toastTitle: "Failed to Action Items",
      toastDescription: "Something went wrong getting action items.",
      returnOnFailure: false,
    });

    if (!response && !response.data) return;
    setActionItemsCount(response?.meta?.total);

    const transformToActionItem = (item: any): ActionItem => {
      const isGmail = item.platform === "gmail";
      const platformData = isGmail ? item.gmail_data : item.slack_data;

      return {
        id: String(`${item?.platform}-${item.id}`),
        title: item.title,
        platform: item.platform,
        message: item?.message,
        sender: isGmail
          ? platformData?.from?.split("<")[0]?.trim() || "Unknown"
          : platformData?.sender || "Unknown",
        isVip: false, // Placeholder – set via business logic
        priorityPerson: undefined, // Set if needed by keyword/name detection
        triggerKeyword: undefined, // Set if keyword-based filtering is applied
        urgency: item.priority as 'high' | 'medium' | 'low',
        tag: item.tag as 'critical' | 'decision' | 'approval' | 'heads-up',
        isNew: !item.status,
        createdAt: item.created_at,
        threadUrl: item.redirect_link,
        completed: item.status,
        lastActivity: platformData?.received_at || platformData?.sent_at || item.created_at,
      };
    };
    
    const data = response?.data?.map(transformToActionItem);
    setActionItems(data);
  }, [call, setActionItemsCount]);

  useEffect(() => {
    getActionItems();
  }, [getActionItems]);

  // Filter and sort action items
  const openItems = actionItems.filter(item => !item.completed).filter(item => {
    if (!filter) return true;
    if (filter === 'vip') return item.isVip;
    if (filter === 'person') return item.priorityPerson;
    if (filter === 'trigger') return item.triggerKeyword;
    if (filter === 'urgency') return item.urgency;
    if (filter === 'new') return item.isNew;
    return true;
  }).sort((a, b) => {
    // VIP first
    if (a.isVip && !b.isVip) return -1;
    if (!a.isVip && b.isVip) return 1;

    // Highest urgency next
    const urgencyOrder = {
      'critical': 0,
      'high': 1,
      'medium': 2,
      'low': 3
    };
    const aUrgency = a.urgency ? urgencyOrder[a.urgency] : 4;
    const bUrgency = b.urgency ? urgencyOrder[b.urgency] : 4;
    if (aUrgency !== bUrgency) return aUrgency - bUrgency;

    // Newest "new" items
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    // Most recent activity
    return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
  });

  const openCount = openItems.length;

  const handleItemClick = useCallback((item: ActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleMarkDone = useCallback(async (selectedItem: ActionItem, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click
    }

    const response = await call("post", `/action-item/update`, {
      body: {
        id: selectedItem?.id?.replace(`${selectedItem?.platform}-`, ''),
        platform: selectedItem?.platform,
        status: true
      },
        showToast: true,
        toastTitle: "Failed to Mark Done",
        toastDescription: "Something went wrong. Please try again.",
        returnOnFailure: false,
    });

    if (!response && !response.data) return;

    await getActionItems();

    // Toast with undo option
    toast({
      title: "Action Item Completed",
      description: `"${selectedItem?.title}" marked as done`,
      action: <Button size="sm" variant="outline" onClick={async () => {
            const response = await call("post", `/action-item/update`, {
            body: {
              id: selectedItem?.id?.replace(`${selectedItem?.platform}-`, ''),
              platform: selectedItem?.platform,
              status: false
            },
              showToast: true,
              toastTitle: "Failed to Mark Done",
              toastDescription: "Something went wrong. Please try again.",
              returnOnFailure: false,
          });

          if (!response && !response.data) return;

          await getActionItems();
      }}>
          Undo
        </Button>
    });
  }, [toast, call, getActionItems]);

  const handleMarkAllDone = useCallback(() => {
    setActionItems(prev => prev.map(item => ({
      ...item,
      completed: true
    })));

    toast({
      title: "All Items Completed",
      description: "All action items marked as done"
    });
  }, [toast]);

  const handleTagClick = useCallback((tagType: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setFilter(filter === tagType ? null : tagType);
  }, [filter]);

  const handleClearFilter = useCallback(() => {
    setFilter(null);
  }, []);

  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? <Slack className="w-4 h-4 text-purple-500" /> : <Mail className="w-4 h-4 text-blue-500" />;
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;
    const urgencyConfig = {
      'high': {
        label: 'High',
        className: 'bg-orange-500/20 text-orange-400'
      },
      'medium': {
        label: 'Medium',
        className: 'bg-yellow-500/20 text-yellow-400'
      },
      'low': {
        label: 'Low',
        className: 'bg-gray-500/20 text-gray-400'
      }
    };

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig];

    if (!config) return null;

    return <Badge variant="secondary" className={`text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${config.className}`} onClick={e => handleTagClick('urgency', e)}>
        {config.label}
      </Badge>;
  };

    const getBadgeColor = (badge: string) => {
        switch (badge?.toLowerCase()) {
            case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
            case "decision": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
            case "approval": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
            case "heads-Up": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
            default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    const getBadgeEmoji = (badge: string) => {
        switch (badge?.toLowerCase()) {
            case "critical": return "🔴";
            case "decision": return "🔵";
            case "approval": return "🟠";
            case "heads-up": return "⚫";
            default: return "⚫";
        }
    };

  // Empty state - collapsed single line
  if (openCount === 0) {
    return <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm p-4", className)}>
        <div className="flex items-center justify-center text-text-secondary">
          <span className="text-sm">All clear ✅</span>
        </div>
      </div>;
  }

  return <>
      <div 
        className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm", className)}
        onMouseEnter={() => setIsSectionHovered(true)}
        onMouseLeave={() => setIsSectionHovered(false)}
      >
        {/* Top section with filter indicator and mark all done button */}
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between">
            {/* Filter indicator */}
            <div className="flex-1">
              {filter && (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>Filtered by: {filter}</span>
                  <button onClick={handleClearFilter} className="text-accent-primary hover:text-accent-primary/80">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Mark all done button - top right, shows on hover */}
            <div 
              className="flex items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {isHovered && (
                <button 
                  onClick={handleMarkAllDone} 
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Mark all done
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Items List */}
        <div className="p-4 pt-2">
          <ScrollArea className="max-h-[280px] -mx-1 px-1">
            <div className="space-y-2">
              {openItems.slice(0, 4).map(item => <div key={item.id} onClick={() => handleItemClick(item)} className="group cursor-pointer">
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    {/* Source Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getSourceIcon(item.platform)}
                    </div>

                    {/* Checkbox */}
                    <button onClick={e => handleMarkDone(item, e)} className="flex-shrink-0 w-4 h-4 mt-0.5 border border-border-subtle rounded hover:border-accent-primary transition-colors">
                      <Check className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <p className="text-text-primary leading-tight mb-1 font-light text-xs">
                        {item.title}
                      </p>
                      
                      {/* Tags Row */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Sender */}
                        <span className="text-xs text-text-secondary">
                          from {item.sender}
                        </span>
                        
                        {/* VIP Star */}
                        {item.isVip && <button onClick={e => handleTagClick('vip', e)} className={`text-green-400 hover:text-green-300 transition-colors ${filter === 'vip' ? 'bg-green-500/20 rounded px-1' : ''}`}>
                            <Star className="w-3 h-3" fill="currentColor" />
                          </button>}
                        
                        {/* Person Tag */}
                        {item.priorityPerson && <Badge variant="secondary" className={`bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${filter === 'person' ? 'bg-blue-500/30' : ''}`} onClick={e => handleTagClick('person', e)}>
                            {item.priorityPerson}
                          </Badge>}
                        
                        {/* Trigger Tag */}
                        {item.triggerKeyword && <Badge variant="secondary" className={`bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${filter === 'trigger' ? 'bg-orange-500/30' : ''}`} onClick={e => handleTagClick('trigger', e)}>
                            {item.triggerKeyword}
                          </Badge>}

                        {item.tag && <Badge className={`text-xs border ${getBadgeColor(item.tag)} flex items-center gap-1 capitalize`}>
                            <span>{getBadgeEmoji(item.tag)}</span>
                            {item.tag}
                        </Badge>}
                        
                        {/* Urgency Tag */}
                        {getUrgencyBadge(item.urgency)}
                      </div>
                    </div>

                    {/* External link icon */}
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                </div>)}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Action Item Modal */}
      <ActionItemModal actionItem={selectedItem} open={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      setSelectedItem(null);
    }} onMarkDone={handleMarkDone} />
    </>;
};

export default ActionItemsPanel;
