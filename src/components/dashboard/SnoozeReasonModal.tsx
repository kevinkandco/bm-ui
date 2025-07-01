
import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface SnoozeReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: (reason: SnoozeReason, customFeedback?: string) => void;
  itemTitle: string;
  sender?: string;
}

export type SnoozeReason = 'message' | 'sender' | 'topic' | 'custom';

const SnoozeReasonModal = ({ 
  isOpen, 
  onClose, 
  onSnooze, 
  itemTitle, 
  sender 
}: SnoozeReasonModalProps) => {
  const [selectedReason, setSelectedReason] = useState<SnoozeReason | null>(null);
  const [customFeedback, setCustomFeedback] = useState("");

  const handleSubmit = () => {
    if (selectedReason) {
      onSnooze(selectedReason, selectedReason === 'custom' ? customFeedback : undefined);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedReason(null);
    setCustomFeedback("");
    onClose();
  };

  const reasons = [
    {
      id: 'message' as SnoozeReason,
      title: 'Snooze this specific message',
      description: 'Hide only this action item'
    },
    ...(sender ? [{
      id: 'sender' as SnoozeReason,
      title: `Snooze messages from ${sender}`,
      description: 'Hide future action items from this person'
    }] : []),
    {
      id: 'topic' as SnoozeReason,
      title: 'Mark this topic as unimportant',
      description: 'Hide similar action items in the future'
    },
    {
      id: 'custom' as SnoozeReason,
      title: 'Other reason',
      description: 'Tell us why you don\'t want to see this'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text-primary">
            Why don't you want to see this?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-surface-raised/30 border border-white/10">
            <p className="text-sm text-text-primary font-medium truncate">
              {itemTitle}
            </p>
          </div>

          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedReason === reason.id
                    ? 'border-primary-teal/50 bg-primary-teal/10'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="snoozeReason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={() => setSelectedReason(reason.id)}
                  className="mt-0.5 text-primary-teal focus:ring-primary-teal"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">
                    {reason.title}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {reason.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {selectedReason === 'custom' && (
            <div className="space-y-2">
              <Textarea
                placeholder="Please tell us why you don't want to see this..."
                value={customFeedback}
                onChange={(e) => setCustomFeedback(e.target.value)}
                className="min-h-[80px] bg-white/5 border-white/20 text-text-primary"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={handleClose}
              className="text-text-secondary hover:text-text-primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedReason || (selectedReason === 'custom' && !customFeedback.trim())}
              className="bg-primary-teal hover:bg-accent-green"
            >
              Snooze Forever
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SnoozeReasonModal;
