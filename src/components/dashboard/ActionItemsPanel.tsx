import React, { useState, useCallback } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ActionItemModal from './ActionItemModal';

interface ActionItem {
  id: string;
  title: string;
  source: 'slack' | 'gmail';
  sender: string;
  isVip: boolean;
  priorityPerson?: string; // Name or initials of flagged person
  triggerKeyword?: string; // Matched trigger keyword
  urgency?: 'critical' | 'high' | 'medium' | 'low';
  isNew: boolean;
  createdAt: string;
  threadUrl: string;
  completed: boolean;
  lastActivity: string;
}

interface ActionItemsPanelProps {
  className?: string;
  onViewAll: () => void;
}

const ActionItemsPanel = ({ className, onViewAll }: ActionItemsPanelProps) => {
  const { toast } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample action items data with new tagging structure
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Approve Q3 budget proposal and financial projections',
      source: 'slack',
      sender: 'Sarah Chen',
      isVip: true,
      priorityPerson: 'Sarah Chen',
      triggerKeyword: 'budget',
      urgency: 'critical',
      isNew: false,
      createdAt: '2024-06-30T08:00:00Z',
      threadUrl: 'https://app.slack.com/client/T123/C456/p789',
      completed: false,
      lastActivity: '2024-06-30T08:00:00Z'
    },
    {
      id: '2', 
      title: 'Review contract amendments',
      source: 'gmail',
      sender: 'legal@company.com',
      isVip: false,
      urgency: 'high',
      isNew: true,
      createdAt: '2024-06-30T09:30:00Z',
      threadUrl: 'https://mail.google.com/mail/u/0/#inbox/abc123',
      completed: false,
      lastActivity: '2024-06-30T09:30:00Z'
    },
    {
      id: '3',
      title: 'Sign off on marketing campaign launch plan',
      source: 'slack',
      sender: 'Mike Johnson',
      isVip: true,
      priorityPerson: 'Mike J',
      triggerKeyword: 'urgent',
      urgency: 'critical',
      isNew: false,
      createdAt: '2024-06-29T14:20:00Z',
      threadUrl: 'https://app.slack.com/client/T123/C456/p790',
      completed: false,
      lastActivity: '2024-06-29T14:20:00Z'
    },
    {
      id: '4',
      title: 'Provide feedback on design mockups',
      source: 'gmail',
      sender: 'design@company.com',
      isVip: false,
      urgency: 'medium',
      isNew: true,
      createdAt: '2024-06-29T11:15:00Z',
      threadUrl: 'https://mail.google.com/mail/u/0/#inbox/def456',
      completed: false,
      lastActivity: '2024-06-29T11:15:00Z'
    }
  ]);

  // Filter and sort action items
  const openItems = actionItems
    .filter(item => !item.completed)
    .filter(item => {
      if (!filter) return true;
      if (filter === 'vip') return item.isVip;
      if (filter === 'person') return item.priorityPerson;
      if (filter === 'trigger') return item.triggerKeyword;
      if (filter === 'urgency') return item.urgency;
      if (filter === 'new') return item.isNew;
      return true;
    })
    .sort((a, b) => {
      // VIP first
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      
      // Highest urgency next
      const urgencyOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
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

  const handleMarkDone = useCallback((itemId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent row click
    }
    
    const item = actionItems.find(i => i.id === itemId);
    
    setActionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: true } : item
      )
    );
    
    // Toast with undo option
    toast({
      title: "Action Item Completed",
      description: `"${item?.title}" marked as done`,
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setActionItems(prev => 
              prev.map(item => 
                item.id === itemId ? { ...item, completed: false } : item
              )
            );
          }}
        >
          Undo
        </Button>
      ),
    });
  }, [actionItems, toast]);

  const handleMarkAllDone = useCallback(() => {
    setActionItems(prev => 
      prev.map(item => ({ ...item, completed: true }))
    );
    
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
    return source === 'slack' ? (
      <Slack className="w-4 h-4 text-purple-500" />
    ) : (
      <Mail className="w-4 h-4 text-blue-500" />
    );
  };

  const getUrgencyBadge = (urgency?: string) => {
    if (!urgency) return null;
    
    const urgencyConfig = {
      'critical': { label: 'Critical', className: 'bg-red-500/20 text-red-400' },
      'high': { label: 'High', className: 'bg-orange-500/20 text-orange-400' },
      'medium': { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400' },
      'low': { label: 'Low', className: 'bg-gray-500/20 text-gray-400' }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
    if (!config) return null;
    
    return (
      <Badge 
        variant="secondary" 
        className={`text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${config.className}`}
        onClick={(e) => handleTagClick('urgency', e)}
      >
        {config.label}
      </Badge>
    );
  };

  // Empty state - collapsed single line
  if (openCount === 0) {
    return (
      <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm p-4", className)}>
        <div className="flex items-center justify-center text-text-secondary">
          <span className="text-sm">All clear ✅</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm", className)}>
        {/* Filter indicator */}
        {filter && (
          <div className="p-3 pb-0">
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <span>Filtered by: {filter}</span>
              <button 
                onClick={handleClearFilter}
                className="text-accent-primary hover:text-accent-primary/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Action Items List */}
        <div className="p-4">
          <ScrollArea className="max-h-[200px] -mx-1 px-1">
            <div className="space-y-3">
              {openItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group cursor-pointer"
                >
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    {/* Source Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      {getSourceIcon(item.source)}
                    </div>

                    {/* Checkbox */}
                    <button
                      onClick={(e) => handleMarkDone(item.id, e)}
                      className="flex-shrink-0 w-4 h-4 mt-0.5 border border-border-subtle rounded hover:border-accent-primary transition-colors"
                    >
                      <Check className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Tags and Title */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {/* VIP Star - First Priority */}
                        {item.isVip && (
                          <button
                            onClick={(e) => handleTagClick('vip', e)}
                            className={`text-green-400 hover:text-green-300 transition-colors ${filter === 'vip' ? 'bg-green-500/20 rounded px-1' : ''}`}
                          >
                            <Star className="w-3 h-3" fill="currentColor" />
                          </button>
                        )}
                        
                        {/* Person Tag - Second Priority */}
                        {item.priorityPerson && (
                          <Badge 
                            variant="secondary" 
                            className={`bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${filter === 'person' ? 'bg-blue-500/30' : ''}`}
                            onClick={(e) => handleTagClick('person', e)}
                          >
                            {item.priorityPerson}
                          </Badge>
                        )}
                        
                        {/* Trigger Tag - Third Priority */}
                        {item.triggerKeyword && (
                          <Badge 
                            variant="secondary" 
                            className={`bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0 cursor-pointer hover:opacity-80 ${filter === 'trigger' ? 'bg-orange-500/30' : ''}`}
                            onClick={(e) => handleTagClick('trigger', e)}
                          >
                            {item.triggerKeyword}
                          </Badge>
                        )}
                        
                        {/* Urgency Tag - Fourth Priority */}
                        {getUrgencyBadge(item.urgency)}
                        
                        {/* Title */}
                        <p className="text-sm text-text-primary truncate font-medium flex-1 min-w-0">
                          {item.title}
                        </p>
                      </div>
                      
                      {/* Metadata */}
                      <p className="text-xs text-text-secondary truncate">
                        from {item.sender}
                      </p>
                    </div>

                    {/* External link icon */}
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
            <button
              onClick={onViewAll}
              className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
            >
              View all
            </button>
            <span className="text-text-secondary text-sm">·</span>
            <button
              onClick={handleMarkAllDone}
              className="text-sm text-text-secondary hover:text-accent-primary transition-colors"
            >
              Mark all done
            </button>
          </div>
        </div>
      </div>

      {/* Action Item Modal */}
      <ActionItemModal
        actionItem={selectedItem}
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onMarkDone={handleMarkDone}
      />
    </>
  );
};

export default ActionItemsPanel;
