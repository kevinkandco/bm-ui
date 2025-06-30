
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {getSourceIcon(actionItem.source)}
            <span>Action Item Details</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
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
            
            {getUrgencyBadge(actionItem.urgency)}
            
            {actionItem.isNew && (
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 text-sm px-2 py-1">
                new
              </Badge>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {actionItem.title}
            </h3>
            <p className="text-text-secondary">
              from {actionItem.sender}
            </p>
          </div>

          {/* Metadata */}
          <div className="bg-surface-raised/30 rounded-lg p-4 space-y-2">
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
