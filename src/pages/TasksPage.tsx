import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Slack, Mail, ExternalLink, Check, Star, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ActionItemModal from '@/components/dashboard/ActionItemModal';
import { ActionItem } from '@/components/dashboard/types';
import { useApi } from '@/hooks/useApi';
import Pagination from '@/components/dashboard/Pagination';

const TasksPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });
  const { call } = useApi();
  
  // Sample action items data with new tagging structure
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const getActionItems = useCallback(async (page = 1) => {
    const response = await call("get", `/action-items?par_page=10&page=${page}`, {
      showToast: true,
      toastTitle: "Failed to Action Items",
      toastDescription: "Something went wrong getting action items.",
      returnOnFailure: false,
    });

    if (!response && !response.data) return;

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
        urgency: item.priority as 'critical' | 'high' | 'medium' | 'low',
        isNew: !item.status,
        createdAt: item.created_at,
        threadUrl: item.redirect_link,
        completed: item.status,
        lastActivity: platformData?.received_at || platformData?.sent_at || item.created_at,
      };
    };
    
    const data = response?.data?.map(transformToActionItem);
    setPagination((prev) => ({
      ...prev,
      currentPage: response?.meta?.current_page || 1,
      totalPages: response?.meta?.last_page || 1,
    }));
    setActionItems(data);
  }, [call]);

  useEffect(() => {
    getActionItems();
  }, [getActionItems]);

  // Filter and sort action items
  const filteredItems = actionItems
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

  const handleItemClick = useCallback((item: ActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleMarkDone = useCallback(async (selectedItem: ActionItem) => {
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

    await getActionItems(pagination.currentPage);
    
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

          await getActionItems(pagination.currentPage);
      }}>
          Undo
        </Button>
    });
  }, [call, toast, getActionItems, pagination]);

  const groupTaskIdsByPlatform = useCallback((data: ActionItem[]) => {
    const result = {
      slack_task: [] as number[],
      gmail_task: [] as number[],
    };

    for (const item of data) {
      const itemId = Number(item?.id?.replace(`${item?.platform}-`, '') || '');
      if (item.platform === "slack") {
        result.slack_task.push(itemId);
      } else if (item.platform === "gmail") {
        result.gmail_task.push(itemId);
      }
    }

    return result;
  }, [])

  const handleMarkAllDone = useCallback(async () => {
    const body = groupTaskIdsByPlatform(actionItems);

    const response = await call("post", `/action-item/mark-all`, {
        body,
        showToast: true,
        toastTitle: "Failed to Mark Done",
        toastDescription: "Something went wrong. Please try again.",
        returnOnFailure: false,
    });

    if (!response && !response.data) return;

    await getActionItems(pagination.currentPage);
    
    toast({
      title: "All Items Completed",
      description: "All action items marked as done"
    });
  }, [toast, actionItems, groupTaskIdsByPlatform, call, pagination, getActionItems]);

  const handleUpdatePriority = useCallback(async (selectedItem: ActionItem, newUrgency: 'critical' | 'high' | 'medium' | 'low') => {
    const itemId = selectedItem?.id?.replace(`${selectedItem?.platform}-`, '') || '';

    const response = await call("post", `/action-item/update`, {
      body: {
        id: itemId,
        platform: selectedItem?.platform,
        priority: newUrgency
      },
        showToast: true,
        toastTitle: "Failed to Mark Done",
        toastDescription: "Something went wrong. Please try again.",
        returnOnFailure: false,
    });

    if (!response && !response.data) return;

    setActionItems(prev => 
      prev.map(item => 
        item.id === selectedItem?.id ? { ...item, urgency: newUrgency } : item
      )
    );
    
    toast({
      title: "Priority Updated",
      description: `Priority set to ${newUrgency}`
    });
  }, [toast, call]);

  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? (
      <Slack className="w-4 h-4 text-purple-500" />
    ) : (
      <Mail className="w-4 h-4 text-blue-500" />
    );
  };

  const getUrgencyBadge = (urgency?: string, selectedItem?: ActionItem) => {
    if (!urgency) return null;
    
    const urgencyConfig = {
      'critical': { label: 'Critical', className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30' },
      'high': { label: 'High', className: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' },
      'medium': { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' },
      'low': { label: 'Low', className: 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30' }
    };
    
    const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
    if (!config) return null;
    
    const urgencyOptions = ['critical', 'high', 'medium', 'low'] as const;
    
    return (
      <div className="relative group">
        <Badge 
          variant="secondary" 
          className={`text-xs px-1.5 py-0 cursor-pointer transition-colors ${config.className}`}
        >
          {config.label}
        </Badge>
        
        {/* Dropdown menu on hover */}
        <div className="absolute top-full left-0 mt-1 bg-surface-overlay border border-border-subtle rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 min-w-[100px]">
          {urgencyOptions.map((option) => (
            <button
              key={option}
              onClick={(e) => {
                e.stopPropagation();
                if (selectedItem) handleUpdatePriority(selectedItem, option);
              }}
              className={`block w-full text-left px-3 py-2 text-xs capitalize hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg ${
                option === urgency ? 'bg-white/5 text-accent-primary' : 'text-text-secondary'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
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
              className="pl-10 bg-transparent border-border-subtle"
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
            variant="ghost"
            disabled={filteredItems.length === 0}
            className="border border-border-subtle hover:bg-white/5"
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
                  {getSourceIcon(item.platform)}
                </div>

                {/* Checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkDone(item);
                  }}
                  className="flex-shrink-0 w-4 h-4 mt-0.5 border border-border-subtle rounded hover:border-accent-primary transition-colors"
                >
                  <Check className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0 flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <p className="text-sm text-text-primary font-medium mb-1">
                      {item.title}
                    </p>
                    
                    {/* Metadata */}
                    <p className="text-xs text-text-secondary">
                      from {item.sender} • {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Tags - Right Side */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {/* VIP Star */}
                    {item.isVip && (
                      <div className="text-green-400">
                        <Star className="w-3 h-3" fill="currentColor" />
                      </div>
                    )}
                    
                    {/* Person Tag */}
                    {item.priorityPerson && (
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0">
                        {item.priorityPerson}
                      </Badge>
                    )}
                    
                    {/* Trigger Tag */}
                    {item.triggerKeyword && (
                      <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0">
                        {item.triggerKeyword}
                      </Badge>
                    )}
                    
                    {/* Urgency Tag - Clickable */}
                    {getUrgencyBadge(item.urgency, item)}
                    
                    {/* External link icon */}
                    <ExternalLink className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
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
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={getActionItems}
            />
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
