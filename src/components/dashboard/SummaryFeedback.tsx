
import React, { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SummaryFeedbackProps {
  briefId: string;
  onFeedback: (type: 'up' | 'down', comment?: string) => void;
  showTooltip?: boolean;
}

const SummaryFeedback = ({ briefId, onFeedback, showTooltip = false }: SummaryFeedbackProps) => {
  const [selectedFeedback, setSelectedFeedback] = useState<'up' | 'down' | null>(null);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type: 'up' | 'down') => {
    setSelectedFeedback(type);
    
    if (type === 'down') {
      setShowCommentInput(true);
    } else {
      setIsSubmitting(true);
      await onFeedback(type);
      setIsSubmitting(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    await onFeedback('down', comment.trim());
    setShowCommentInput(false);
    setComment("");
    setIsSubmitting(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  return (
    <div className="border-t border-white/10 pt-4 mt-6">
      <div className="flex items-center justify-center space-x-4">
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('up')}
                  disabled={isSubmitting}
                  className={`transition-all ${
                    selectedFeedback === 'up' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-text-secondary hover:text-green-400'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('down')}
                  disabled={isSubmitting}
                  className={`transition-all ${
                    selectedFeedback === 'down' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'text-text-secondary hover:text-red-400'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Help Brief.me learn — tap 👍 or 👎</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showCommentInput && (
        <div className="mt-4 animate-fade-in">
          <Input
            placeholder="What did we miss? (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-white/5 border-white/20 text-text-primary"
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowCommentInput(false);
                setComment("");
              }}
            >
              Skip
            </Button>
            <Button
              size="sm"
              onClick={handleCommentSubmit}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryFeedback;
