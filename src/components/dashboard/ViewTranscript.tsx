
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Summary } from "./types";

interface BriefModalProps {
  open: boolean;
  onClose: () => void;
  summary: string;
}

const ViewTranscript = ({ open, onClose, summary }: BriefModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-96 overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-white">Transcript</DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <p className="text-white/90 text-md">{summary}</p>
        </div> 
      </DialogContent>
    </Dialog>
  );
};

export default ViewTranscript;
