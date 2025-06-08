
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Clock, User, Target, Brain, CheckSquare, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriorityReasoningModalProps {
  open: boolean;
  onClose: () => void;
  actionItem: {
    id: string;
    text: string;
    source: string;
    priority: string;
    messageId: string;
    reasoning: string;
    fullMessage: string;
    time: string;
    sender: string;
    subject?: string;
    channel?: string;
    relevancy: string;
    triggerPhrase: string;
    ruleHit: string;
    priorityLogic: string;
    confidence: string;
  };
}

const PriorityReasoningModal = ({ open, onClose, actionItem }: PriorityReasoningModalProps) => {
  const { toast } = useToast();

  const handleOpenInPlatform = () => {
    toast({
      title: `Opening in ${actionItem.source === 'slack' ? 'Slack' : 'Gmail'}`,
      description: `Redirecting to ${actionItem.source} message...`
    });
  };

  const handleMarkNotRelevant = () => {
    toast({
      title: "Feedback Recorded",
      description: "This action item has been marked as not relevant. We'll improve our detection."
    });
    onClose();
  };

  const handleLowerPriority = () => {
    toast({
      title: "Priority Updated",
      description: "This action item priority has been lowered. We'll learn from this feedback."
    });
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/20 border-red-400/40";
      case "medium": return "text-orange-400 bg-orange-400/20 border-orange-400/40";
      case "low": return "text-green-400 bg-green-400/20 border-green-400/40";
      default: return "text-text-secondary bg-surface-raised/20 border-border-subtle";
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case "high": return "text-green-400";
      case "medium": return "text-orange-400";
      case "low": return "text-red-400";
      default: return "text-text-secondary";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-surface border-border-subtle">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold text-text-primary flex items-center gap-2">
            <Target className="h-5 w-5 text-accent-primary" />
            Priority Reasoning
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Item Summary */}
          <div className="p-4 bg-surface-overlay/30 rounded-lg border border-border-subtle">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-text-primary">Action Item</h3>
              <Badge variant="secondary" className={`text-xs h-5 px-2 ${getPriorityColor(actionItem.priority)}`}>
                {actionItem.priority} priority
              </Badge>
            </div>
            <p className="text-text-secondary">{actionItem.text}</p>
          </div>

          {/* The Origin */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              The Origin
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">Sender:</span>
                  <span className="text-sm text-text-secondary">{actionItem.sender}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">Timestamp:</span>
                  <span className="text-sm text-text-secondary">{actionItem.time}</span>
                </div>
              </div>

              <div className="space-y-2">
                {actionItem.subject && (
                  <div>
                    <span className="text-sm font-medium text-text-primary">Subject:</span>
                    <span className="text-sm text-text-secondary ml-2">{actionItem.subject}</span>
                  </div>
                )}
                
                {actionItem.channel && (
                  <div>
                    <span className="text-sm font-medium text-text-primary">Channel:</span>
                    <span className="text-sm text-text-secondary ml-2">{actionItem.channel}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-surface-raised/20 rounded-lg">
              <div className="mb-2">
                <span className="text-sm font-medium text-text-primary">Trigger Phrase:</span>
              </div>
              <p className="text-sm text-text-secondary">
                "{actionItem.triggerPhrase}"
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenInPlatform}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in {actionItem.source === 'slack' ? 'Slack' : 'Gmail'}
            </Button>
          </div>

          {/* The Reasoning */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Brain className="h-4 w-4" />
              The Reasoning
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-surface-raised/20 rounded-lg">
                <div className="mb-1">
                  <span className="text-sm font-medium text-text-primary">Rule Hit:</span>
                </div>
                <p className="text-sm text-text-secondary">{actionItem.ruleHit}</p>
              </div>

              <div className="p-3 bg-surface-raised/20 rounded-lg">
                <div className="mb-1">
                  <span className="text-sm font-medium text-text-primary">Priority Logic:</span>
                </div>
                <p className="text-sm text-text-secondary">{actionItem.priorityLogic}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-text-primary">Confidence Score:</span>
                <Badge variant="outline" className={`${getConfidenceColor(actionItem.confidence)}`}>
                  {actionItem.confidence}
                </Badge>
              </div>
            </div>
          </div>

          {/* Suggested Next Steps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Suggested Next Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button variant="outline" size="sm" className="justify-start">
                Add to Asana
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                Schedule Follow-up
              </Button>
              <Button variant="outline" size="sm" className="justify-start">
                Set Reminder
              </Button>
            </div>
          </div>

          {/* Feedback Actions */}
          <div className="pt-4 border-t border-border-subtle/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Help us improve by providing feedback:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkNotRelevant}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Not an Action
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLowerPriority}
                  className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10"
                >
                  Lower Priority
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityReasoningModal;
