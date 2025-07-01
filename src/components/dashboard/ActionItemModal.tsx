
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slack, Mail, ExternalLink, Star, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ActionItemModalProps {
  actionItem: ActionItem | null;
  open: boolean;
  onClose: () => void;
  onMarkDone: (itemId: string) => void;
}

const ActionItemModal = ({ actionItem, open, onClose, onMarkDone }: ActionItemModalProps) => {
  const { toast } = useToast();

  if (!actionItem) return null;

  // Mock detailed content - in a real app this would come from the action item data
  const mockFullMessage = `Hi Alex, I hope you're doing well. I wanted to follow up on the launch materials we discussed yesterday. The marketing team needs your review and approval by 2 PM today to stay on track with our product launch timeline. The materials include the press release, social media assets, and the updated landing page copy. Please let me know if you have any questions or need any changes. Thanks!`;
  
  const mockRelevancyReason = "Critical - blocking marketing team progress";
  const mockActionReason = "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.";

  const handleOpenThread = () => {
    window.open(actionItem.threadUrl, '_blank');
    toast({
      title: "Opening Thread",
      description: `Opening ${actionItem.source === 'slack' ? 'Slack' : 'Gmail'} thread in new tab`
    });
  };

  const handleMarkDone = () => {
    onMarkDone(actionItem.id);
    onClose();
  };

  const getSourceIcon = (source: 'slack' | 'gmail') => {
    return source === 'slack' ? (
      <Slack className="w-5 h-5 text-purple-500" />
    ) : (
      <Mail className="w-5 h-5 text-blue-500" />
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
      <Badge variant="secondary" className={`text-sm px-2 py-1 ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getSourceIcon(actionItem.source)}
            <span>{actionItem.title}</span>
            <div className="text-sm text-text-secondary font-normal">
              7:45 AM
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with sender info and tags */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-text-secondary">From: {actionItem.sender}</div>
                <div className="text-sm text-text-secondary">
                  Subject: {actionItem.source === 'gmail' ? 'Urgent: Launch Materials Review Needed' : actionItem.title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Add to Asana
                </Button>
                <Button size="sm" variant="outline" className="text-xs" onClick={handleOpenThread}>
                  Open in {actionItem.source === 'slack' ? 'Slack' : 'Gmail'}
                </Button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              {getUrgencyBadge(actionItem.urgency)}
              
              {actionItem.isVip && (
                <div className="text-green-400">
                  <Star className="w-4 h-4" fill="currentColor" />
                </div>
              )}
              
              {actionItem.priorityPerson && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1">
                  {actionItem.priorityPerson}
                </Badge>
              )}
              
              {actionItem.triggerKeyword && (
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 text-sm px-2 py-1">
                  {actionItem.triggerKeyword}
                </Badge>
              )}
              
              {actionItem.isNew && (
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1">
                  new
                </Badge>
              )}
            </div>
          </div>

          {/* Full Message */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text-primary">Full Message:</h4>
            <div className="bg-surface-raised/30 rounded-lg p-4 text-sm text-text-primary leading-relaxed border border-border-subtle">
              {mockFullMessage}
            </div>
          </div>

          {/* Two column layout for relevancy and action reasoning */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Relevancy */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">Relevancy:</h4>
              <div className="text-sm text-text-secondary">
                {mockRelevancyReason}
              </div>
            </div>

            {/* Why this is an action item */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">Why this is an action item:</h4>
              <div className="text-sm text-text-secondary">
                {mockActionReason}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-surface-raised/30 rounded-lg p-4 space-y-2 border border-border-subtle">
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Created:</span>
              <span className="text-text-primary">
                {new Date(actionItem.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Last Activity:</span>
              <span className="text-text-primary">
                {new Date(actionItem.lastActivity).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Source:</span>
              <span className="text-text-primary capitalize">{actionItem.source}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Due:</span>
              <span className="text-text-primary">2 PM today</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleOpenThread} className="flex-1">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open in {actionItem.source === 'slack' ? 'Slack' : 'Gmail'}
            </Button>
            <Button onClick={handleMarkDone} variant="outline" className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Mark Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActionItemModal;
