
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TranscriptViewProps {
  open: boolean;
  onClose: () => void;
  briefId: number | null;
}

const TranscriptView = ({ open, onClose, briefId }: TranscriptViewProps) => {
  const transcript = `
Hello and welcome to your Morning Brief for December 8th, 2024. This brief covers activity from 5:00 AM to 8:00 AM.

Starting with your Slack messages, you received 12 messages across 5 channels. The most important updates come from the #product-launch channel where Sarah mentioned potential delays in the testing phase. She's concerned about the timeline and needs your input on prioritization.

Moving to your emails, you have 5 new messages with 2 marked as high priority. The marketing team has sent launch materials that require your review by 2 PM today. Finance is also requesting approval for Q4 budget allocations.

For action items, I've identified 4 items that need your attention:

First, reviewing the launch materials from the marketing team. This is time-sensitive with a 2 PM deadline today.

Second, approving the Q4 budget allocations requested by finance. This affects resource planning for the next quarter.

Third, responding to Sarah's concerns about the testing phase timeline. The product team is waiting for direction.

Fourth, scheduling a follow-up meeting with the product team for next week to address ongoing concerns.

That concludes your Morning Brief. You've saved approximately 33 minutes of reading and processing time. Have a productive day!
  `;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Audio Transcript - Brief {briefId}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="prose max-w-none">
            <div className="bg-muted/30 rounded-lg p-4 border">
              <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {transcript.trim()}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TranscriptView;
