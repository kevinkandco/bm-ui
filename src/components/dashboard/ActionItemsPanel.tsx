
import React, { useState, useCallback } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: string;
  title: string;
  source: 'slack' | 'gmail';
  sender: string;
  isVip: boolean;
  dueDate?: string;
  isNew: boolean;
  createdAt: string;
  threadUrl: string;
  completed: boolean;
}

interface ActionItemsPanelProps {
  className?: string;
}

const ActionItemsPanel = ({ className }: ActionItemsPanelProps) => {
  const { toast } = useToast();
  
  // Sample action items data - in a real app this would come from your state/API
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Approve Q3 budget',
      source: 'slack',
      sender: 'Sarah Chen',
      isVip: true,
      dueDate: 'Today',
      isNew: false,
      createdAt: '2024-06-30T08:00:00Z',
      threadUrl: 'https://app.slack.com/client/T123/C456/p789',
      completed: false
    },
    {
      id: '2', 
      title: 'Review contract amendments',
      source: 'gmail',
      sender: 'legal@company.com',
      isVip: false,
      dueDate: 'Tomorrow',
      isNew: true,
      createdAt: '2024-06-30T09:30:00Z',
      threadUrl: 'https://mail.google.com/mail/u/0/#inbox/abc123',
      completed: false
    },
    {
      id: '3',
      title: 'Sign off on marketing campaign',
      source: 'slack',
      sender: 'Mike Johnson',
      isVip: true,
      dueDate: undefined,
      isNew: false,
      createdAt: '2024-06-29T14:20:00Z',
      threadUrl: 'https://app.slack.com/client/T123/C456/p790',
      completed: false
    },
    {
      id: '4',
      title: 'Provide feedback on design mockups',
      source: 'gmail',
      sender: 'design@company.com',
      isVip: false,
      dueDate: undefined,
      isNew: true,
      createdAt: '2024-06-29T11:15:00Z',
      threadUrl: 'https://mail.google.com/mail/u/0/#inbox/def456',
      completed: false
    }
  ]);

  // Filter and sort action items
  const openItems = actionItems
    .filter(item => !item.completed)
    .sort((a, b) => {
      // VIP senders first
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      
      // Items with deadlines next
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Oldest first
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

  const openCount = openItems.length;

  const handleItemClick = useCallback((item: ActionItem) => {
    // Open in new tab
    window.open(item.threadUrl, '_blank');
    
    toast({
      title: "Opening Thread",
      description: `Opening ${item.source === 'slack' ? 'Slack' : 'Gmail'} thread in new tab`
    });
  }, [toast]);

  const handleMarkDone = useCallback((itemId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click
    
    setActionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: true } : item
      )
    );
    
    toast({
      title: "Action Item Completed",
      description: "Item marked as done and archived"
    });
  }, [toast]);

  const handleViewAll = useCallback(() => {
    // In a real app, this would navigate to the full action items view
    toast({
      title: "Action Inbox",
      description: "Opening full action items view..."
    });
  }, [toast]);

  const handleMarkAllDone = useCallback(() => {
    setActionItems(prev => 
      prev.map(item => ({ ...item, completed: true }))
    );
    
    toast({
      title: "All Items Completed",
      description: "All action items marked as done"
    });
  }, [toast]);

  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? (
      <Slack className="w-4 h-4 text-purple-500" />
    ) : (
      <Mail className="w-4 h-4 text-blue-500" />
    );
  };

  return (
    <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm", className)}>
      {/* Count badge in top corner */}
      {openCount > 0 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="secondary" className="bg-accent-primary/20 text-accent-primary text-xs px-2 py-0.5">
            {openCount}
          </Badge>
        </div>
      )}

      {/* Action Items List */}
      <div className="p-4">
        {openCount === 0 ? (
          <div className="text-center py-6 text-text-secondary">
            <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">All caught up!</p>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-[200px] -mx-1 px-1">
              <div className="space-y-2">
                {openItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => handleMarkDone(item.id, e)}
                      className="flex-shrink-0 w-4 h-4 border border-border-subtle rounded hover:border-accent-primary transition-colors"
                    >
                      <Check className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>

                    {/* Source Icon */}
                    <div className="flex-shrink-0">
                      {getSourceIcon(item.source)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-text-primary truncate font-medium">
                          {item.title}
                        </p>
                        {item.isNew && (
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0">
                            new
                          </Badge>
                        )}
                        {item.dueDate && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0">
                            {item.dueDate}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary truncate">
                        from {item.sender}
                        {item.isVip && <span className="text-accent-primary ml-1">★</span>}
                      </p>
                    </div>

                    {/* External link icon */}
                    <ExternalLink className="w-3 h-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
              <button
                onClick={handleViewAll}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ActionItemsPanel;
