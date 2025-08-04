import React, { useState, useCallback } from 'react';
import { CheckSquare, Slack, Mail, ExternalLink, Check, Star, X, ArrowUpRight } from 'lucide-react';
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
  onViewAll: () => void;
}
const ActionItemsPanel = ({
  className
}: Omit<ActionItemsPanelProps, 'onViewAll'>) => {
  const {
    toast
  } = useToast();
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSectionHovered, setIsSectionHovered] = useState(false);

  // Sample action items data matching the wireframe
  const [actionItems, setActionItems] = useState<ActionItem[]>([{
    id: '1',
    title: 'Review finances',
    source: 'gmail',
    sender: 'Sara Chen',
    tag: 'Deadline',
    completed: false
  }, {
    id: '2',
    title: 'Schedule follow up with Mike',
    source: 'gmail',
    sender: 'Sara Chen',
    tag: 'Action',
    completed: false
  }, {
    id: '3',
    title: 'Decide on new logo',
    source: 'gmail',
    sender: 'Sara Chen',
    tag: 'Decision',
    completed: false
  }, {
    id: '4',
    title: 'Respond to confirm funding',
    source: 'slack',
    sender: 'Sara Chen',
    tag: 'Decision',
    completed: false
  }]);

  // Filter and sort action items
  const openItems = actionItems.filter(item => !item.completed);
  const openCount = openItems.length;
  const handleItemClick = useCallback((item: ActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);
  const handleMarkDone = useCallback((itemId: string) => {
    const item = actionItems.find(i => i.id === itemId);
    setActionItems(prev => prev.map(item => item.id === itemId ? {
      ...item,
      completed: !item.completed
    } : item));
  }, [actionItems]);
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
  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? <Slack className="w-4 h-4" /> : <Mail className="w-4 h-4" />;
  };

  // Empty state - collapsed single line
  if (openCount === 0) {
    return <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm p-4", className)}>
        <div className="flex items-center justify-center text-text-secondary">
          <span className="text-sm">All clear ✅</span>
        </div>
      </div>;
  }

  return <div className={cn("border border-border-subtle rounded-2xl bg-surface-overlay/30 shadow-sm", className)}>
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-primary">Follow ups</h2>
          <button className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors">
            View all
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Items List */}
      <div className="px-4 pb-4">
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
    </div>;
};

export default ActionItemsPanel;
