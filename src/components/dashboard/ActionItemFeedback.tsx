
import React, { useState } from "react";
import { MoreVertical, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ActionItemFeedbackProps {
  itemId: string;
  onRelevanceFeedback: (itemId: string, relevant: boolean) => void;
}

const ActionItemFeedback = ({ itemId, onRelevanceFeedback }: ActionItemFeedbackProps) => {
  const [isMarkedIrrelevant, setIsMarkedIrrelevant] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleRelevanceFeedback = (relevant: boolean) => {
    onRelevanceFeedback(itemId, relevant);
    if (!relevant) {
      setIsMarkedIrrelevant(true);
    }
    setIsOpen(false);
  };

  return (
    <div className={`transition-all duration-300 ${isMarkedIrrelevant ? 'opacity-30' : ''}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-text-secondary hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2 bg-surface-raised/95 border border-white/20 backdrop-blur-md">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRelevanceFeedback(false)}
              className="w-full justify-start text-red-400 hover:bg-red-500/20"
            >
              <X className="mr-2 h-3 w-3" />
              Not relevant to me
            </Button>
            <div className="px-2 py-1">
              <p className="text-xs text-text-secondary">
                This will help Brief.me learn your preferences
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionItemFeedback;
