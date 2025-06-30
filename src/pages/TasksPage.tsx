
import React, { useState, useCallback } from 'react';
import { ArrowLeft, CheckSquare, Slack, Mail, ExternalLink, Check, Star, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ActionItemModal from '@/components/dashboard/ActionItemModal';

interface ActionItem {
  id: string;
  title: string;
  source: 'slack' | 'gmail';
  sender: string;
  isVip: boolean;
  urgency?: 'overdue' | 'today' | 'tomorrow' | 'soon';
  isNew: boolean;
  createdAt: string;
  threadUrl: string;
  completed: boolean;
  lastActivity: string;
}

const TasksPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sample action items data - in a real app this would come from your state/API
  const [actionItems, setActionItems] = useState<ActionItem[]>([
    {
      id: '1',
      title: 'Approve Q3 budget proposal and financial projections',
      source: 'slack',
      sender: 'Sarah Chen',
      isVip: true,
      urgency: 'today',
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
      urgency: 'tomorrow',
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
      urgency: 'overdue',
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
      urgency: 'soon',
      isNew: true,
      createdAt: '2024-06-29T11:15:00Z',
      threadUrl: 'https://mail.google.com/mail/u/0/#inbox/def456',
      completed: false,
      lastActivity: '2024-06-29T11:15:00Z'
    },
    {
      id: '5',
      title: 'Complete user research analysis',
      source: 'slack',
      sender: 'Research Team',
      isVip: false,
      urgency: 'today',
      isNew: true,
      createdAt: '2024-06-30T10:00:00Z',
      threadUrl: 'https://app.slack.com/client/T123/C456/p791',
      completed: false,
      lastActivity: '2024-06-30T10:00:00Z'
    }
  ]);

  // Filter and sort action items
  const filteredItems = actionItems
    .filter(item => !item.completed)
    .filter(item => {
      if (!filter) return true;
      if (filter === 'vip') return item.isVip;
      if (filter === 'new') return item.isNew;
      if (filter === 'urgency') return item.urgency;
      return true;
    })
    .filter(item => {
      if (!searchQuery) return true;
      return item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             item.sender.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .sort((a, b) => {
      // VIP first
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;
      
      // Highest urgency next
      const urgencyOrder = { 'overdue': 0, 'today': 1, 'tomorrow': 2, 'soon': 3 };
      const aUrgency = a.urgency ? urgencyOrder[a.urgency] : 4;
      const bUrgency = b.urgency ? urgencyOrder[b.urgency] : 4;
      if (aUrgency !== bUrgency) return aUrgency - bUrgency;
      
      // Newest "new" items
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      
      // Most recent activity
      return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
    });

  const handleItemClick = useCallback((item: ActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleMarkDone = useCallback((itemId: string) => {
    const item = actionItems.find(i => i.id === itemId);
    
    setActionItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed: true } : item
      )
    );
    
    toast({
      title: "Action Item Completed",
      description: `"${item?.title}" marked as done`
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
      'overdue': { label: 'Overdue', className: 'bg-red-500/20 text-red-400' },
      'today': { label: 'Today', className: 'bg-orange-500/20 text-orange-400' },
      'tomorrow': { label: 'Tomorrow', className: 'bg-yellow-500/20 text-yellow-400' },
      'soon': { label: 'Soon', className: 'bg-gray-500/20 text-gray-400' }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
    if (!config) return null;
    
    return (
      <Badge variant="secondary" className={`text-xs px-1.5 py-0 ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Action Items</h1>
            <p className="text-text-secondary">{filteredItems.length} open items</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
            <Input
              placeholder="Search action items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {filter && (
            <Button
              variant="outline"
              onClick={() => setFilter(null)}
              className="flex items-center gap-2"
            >
              Clear filter
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleMarkAllDone}
            variant="outline"
            disabled={filteredItems.length === 0}
          >
            Mark All Done
          </Button>
        </div>

        {/* Action Items List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="group cursor-pointer bg-surface-overlay/30 border border-border-subtle rounded-xl p-4 hover:bg-surface-overlay/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Source Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getSourceIcon(item.source)}
                </div>

                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkDone(item.id);
                  }}
                  className="flex-shrink-0 w-4 h-4 mt-0.5 border border-border-subtle rounded hover:border-accent-primary transition-colors"
                >
                  <Check className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Tags and Title */}
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {/* VIP Star */}
                    {item.isVip && (
                      <div className="text-green-400">
                        <Star className="w-3 h-3" fill="currentColor" />
                      </div>
                    )}
                    
                    {/* Urgency Badge */}
                    {getUrgencyBadge(item.urgency)}
                    
                    {/* New Badge */}
                    {item.isNew && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0">
                        new
                      </Badge>
                    )}
                    
                    {/* Title */}
                    <p className="text-sm text-text-primary font-medium flex-1 min-w-0">
                      {item.title}
                    </p>
                  </div>
                  
                  {/* Metadata */}
                  <p className="text-xs text-text-secondary">
                    from {item.sender} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* External link icon */}
                <ExternalLink className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
              </div>
            </div>
          ))}
          
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="h-12 w-12 text-text-secondary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">All clear!</h3>
              <p className="text-text-secondary">No action items to show</p>
            </div>
          )}
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
    </div>
  );
};

export default TasksPage;
