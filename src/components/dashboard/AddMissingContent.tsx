
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddMissingContentProps {
  onAddContent: (content: string) => void;
}

const AddMissingContent = ({ onAddContent }: AddMissingContentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    await onAddContent(content.trim());
    setContent("");
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  if (!isExpanded) {
    return (
      <div className="border-t border-white/10 pt-6 mt-6">
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(true)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add what's missing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-white/10 pt-6 mt-6 animate-fade-in">
      <h4 className="font-medium text-text-primary mb-3">Add Missing Content</h4>
      <Textarea
        placeholder="What important information did we miss in today's brief?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-white/5 border-white/20 text-text-primary min-h-[100px]"
        autoFocus
      />
      <div className="flex justify-end space-x-2 mt-3">
        <Button
          variant="ghost"
          onClick={() => {
            setIsExpanded(false);
            setContent("");
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
        >
          Add to Brief
        </Button>
      </div>
    </div>
  );
};

export default AddMissingContent;
