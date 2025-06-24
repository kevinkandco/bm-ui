
import React, { useState } from "react";
import { MoreVertical, Check, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

interface ActionItemFeedbackProps {
  itemId: string;
  onRelevanceFeedback: (itemId: string, relevant: boolean, feedback?: string) => void;
}

const ActionItemFeedback = ({ itemId, onRelevanceFeedback }: ActionItemFeedbackProps) => {
  const [isMarkedIrrelevant, setIsMarkedIrrelevant] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showPositiveFeedback, setShowPositiveFeedback] = useState(false);
  const [showNegativeFeedback, setShowNegativeFeedback] = useState(false);
  const [positiveFeedback, setPositiveFeedback] = useState("");
  const [negativeFeedback, setNegativeFeedback] = useState("");

  const handlePositiveFeedback = () => {
    setShowPositiveFeedback(true);
    setShowNegativeFeedback(false);
  };

  const handleNegativeFeedback = () => {
    setShowNegativeFeedback(true);
    setShowPositiveFeedback(false);
  };

  const submitPositiveFeedback = () => {
    onRelevanceFeedback(itemId, true, positiveFeedback.trim() || undefined);
    setPositiveFeedback("");
    setShowPositiveFeedback(false);
    setIsOpen(false);
  };

  const submitNegativeFeedback = () => {
    onRelevanceFeedback(itemId, false, negativeFeedback.trim() || undefined);
    if (!negativeFeedback.trim()) {
      setIsMarkedIrrelevant(true);
    }
    setNegativeFeedback("");
    setShowNegativeFeedback(false);
    setIsOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'positive' | 'negative') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (type === 'positive') {
        submitPositiveFeedback();
      } else {
        submitNegativeFeedback();
      }
    }
  };

  return (
    <div className={`transition-all duration-300 ${isMarkedIrrelevant ? 'opacity-30' : ''}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-text-secondary hover:text-accent-primary"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3 bg-surface-raised/95 border border-white/20 backdrop-blur-md">
          {!showPositiveFeedback && !showNegativeFeedback && (
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePositiveFeedback}
                className="w-full justify-start text-green-400 hover:bg-green-500/20"
              >
                <ThumbsUp className="mr-2 h-3 w-3" />
                Show me things like this
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNegativeFeedback}
                className="w-full justify-start text-red-400 hover:bg-red-500/20"
              >
                <ThumbsDown className="mr-2 h-3 w-3" />
                Don't show me things like this
              </Button>
              <div className="px-2 py-1">
                <p className="text-xs text-text-secondary">
                  Help Brief.me learn your preferences
                </p>
              </div>
            </div>
          )}

          {showPositiveFeedback && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-400">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">Show me things like this</span>
              </div>
              <Textarea
                placeholder="e.g., Always show me things from Kelly, especially if they have budget questions"
                value={positiveFeedback}
                onChange={(e) => setPositiveFeedback(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'positive')}
                className="bg-white/5 border-white/20 text-text-primary text-xs min-h-[60px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={submitPositiveFeedback}
                  className="text-xs h-7 bg-green-600 hover:bg-green-700"
                >
                  Submit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPositiveFeedback(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {showNegativeFeedback && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-400">
                <ThumbsDown className="h-4 w-4" />
                <span className="text-sm font-medium">Don't show me things like this</span>
              </div>
              <Textarea
                placeholder="e.g., Never show me emails from this sender unless I am specifically mentioned"
                value={negativeFeedback}
                onChange={(e) => setNegativeFeedback(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, 'negative')}
                className="bg-white/5 border-white/20 text-text-primary text-xs min-h-[60px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={submitNegativeFeedback}
                  className="text-xs h-7 bg-red-600 hover:bg-red-700"
                >
                  Submit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNegativeFeedback(false)}
                  className="text-xs h-7"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionItemFeedback;
