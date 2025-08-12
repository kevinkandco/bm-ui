import React from "react";
import { X, ExternalLink, Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface FollowUpDetailPanelProps {
  followUp: any;
  open: boolean;
  onClose: () => void;
  onMarkDone?: (id: number) => void;
}

const FollowUpDetailPanel = ({ followUp, open, onClose, onMarkDone }: FollowUpDetailPanelProps) => {
  const { toast } = useToast();

  if (!open || !followUp) return null;

  const handleOpenInPlatform = () => {
    const platform = followUp.platform === 'G' ? 'Gmail' : 'Slack';
    toast({
      description: `Opening ${platform} in new tab`
    });
    // In a real app, this would open the actual platform
  };

  const handleAddToAsana = () => {
    toast({
      description: "Added to Asana",
      variant: "default"
    });
  };

  const handleMarkDone = () => {
    onMarkDone?.(followUp.id);
    toast({
      description: "Marked as done"
    });
    onClose();
  };

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
    title: followUp.platform === 'G' ? "Workspace cancellation" : followUp.message,
    timestamp: followUp.time,
    from: followUp.platform === 'G' ? "The Google Workspace Team" : followUp.sender,
    subject: followUp.platform === 'G' ? "Urgent: Launch Materials Review Needed" : followUp.message,
    fullMessage: followUp.platform === 'G' 
      ? "Your Google Workspace Business Starter subscription was suspended on Jul 28, 2025 and will be canceled on or after Sep 26, 2025 unless you reactivate. Sign in to the Admin console (Billing > Subscriptions) before Sep 26 to keep service; you'll receive a confirmation email within 48 hours after reactivation. Account: kevin@pathnine.co (domain: pathnine.co)."
      : "Hi team, I wanted to follow up on the project timeline we discussed yesterday. We need to finalize the design mockups by end of week to stay on track.",
    relevancy: followUp.platform === 'G' ? "Critical – blocking marketing team progress" : "High – time-sensitive project milestone",
    actionReason: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
    created: "8/12/2025, 1:34:19 PM",
    lastActivity: "8/13/2025, 1:32:39 AM",
    source: followUp.platform === 'G' ? "Gmail" : "Slack",
    due: "2 PM today"
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-background border-l border-border-subtle z-50 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          {getSourceIcon(followUp.platform)}
          <div>
            <h2 className="font-medium text-text-primary">{mockDetails.title}</h2>
            <p className="text-sm text-text-secondary">{mockDetails.timestamp}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        {/* Message Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-end gap-2">
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
          
          <div className="space-y-1">
            <div className="text-sm text-text-secondary">
              <span className="font-medium">From:</span> {mockDetails.from}
            </div>
            <div className="text-sm text-text-secondary">
              <span className="font-medium">Subject:</span> {mockDetails.subject}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2">
          {getPriorityBadge(followUp.priority)}
          <Badge variant="secondary">new</Badge>
        </div>

        {/* Full Message */}
        <div className="space-y-2">
          <h3 className="font-medium text-text-primary">Full Message:</h3>
          <div className="text-sm text-text-secondary leading-relaxed p-3 bg-muted rounded-md">
            {mockDetails.fullMessage}
          </div>
        </div>

        {/* Relevancy */}
        <div className="space-y-2">
          <h3 className="font-medium text-text-primary">Relevancy:</h3>
          <div className="text-sm text-text-secondary">
            {mockDetails.relevancy}
          </div>
        </div>

        {/* Why this is an action item */}
        <div className="space-y-2">
          <h3 className="font-medium text-text-primary">Why this is an action item:</h3>
          <div className="text-sm text-text-secondary">
            {mockDetails.actionReason}
          </div>
        </div>

        {/* Metadata */}
        <div className="space-y-3 pt-4 border-t border-border-subtle">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Created:</span>
              <div className="text-text-secondary">{mockDetails.created}</div>
            </div>
            <div>
              <span className="font-medium text-text-primary">Last Activity:</span>
              <div className="text-text-secondary">{mockDetails.lastActivity}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-text-primary">Source:</span>
              <div className="text-text-secondary capitalize">{mockDetails.source}</div>
            </div>
            <div>
              <span className="font-medium text-text-primary">Due:</span>
              <div className="text-text-secondary">{mockDetails.due}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border-subtle space-y-2">
        <Button 
          onClick={handleOpenInPlatform}
          className="w-full"
          variant="outline"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in {mockDetails.source}
        </Button>
        <Button 
          onClick={handleMarkDone}
          className="w-full"
        >
          <Check className="h-4 w-4 mr-2" />
          Mark Done
        </Button>
      </div>
    </div>
  );
};

export default FollowUpDetailPanel;