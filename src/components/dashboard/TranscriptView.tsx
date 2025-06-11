
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TranscriptViewProps {
  open: boolean;
  onClose: () => void;
  briefId: number | null;
  transcript: string;
}

const TranscriptView = ({ open, onClose, briefId, transcript }: TranscriptViewProps) => {

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
