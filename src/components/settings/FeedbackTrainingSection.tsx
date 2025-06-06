
import React, { useState } from "react";
import { Brain, RotateCcw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FeedbackTrainingSection = () => {
  const { toast } = useToast();
  const [personalizeEnabled, setPersonalizeEnabled] = useState(true);
  const [shareDataEnabled, setShareDataEnabled] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handlePersonalizeToggle = (enabled: boolean) => {
    setPersonalizeEnabled(enabled);
    toast({
      title: enabled ? "Personalization Enabled" : "Personalization Disabled",
      description: enabled 
        ? "Brief.me will use your feedback to improve future briefs"
        : "Brief.me will no longer use your feedback for personalization",
    });
  };

  const handleShareDataToggle = (enabled: boolean) => {
    setShareDataEnabled(enabled);
    toast({
      title: enabled ? "Data Sharing Enabled" : "Data Sharing Disabled",
      description: enabled 
        ? "Your anonymized feedback will help improve Brief.me for everyone"
        : "Your feedback will only be used for your personal briefs",
    });
  };

  const handleResetPersonalization = async () => {
    setIsResetting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsResetting(false);
    setShowResetDialog(false);
    toast({
      title: "Personalization Reset",
      description: "Your learned preferences have been cleared. Brief.me will start fresh.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Brain className="h-5 w-5 text-accent-primary" />
        <h2 className="text-xl font-semibold text-text-primary">Feedback & Training</h2>
      </div>

      <div className="space-y-6">
        {/* Personalization Setting */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-md">
            <h3 className="font-medium text-text-primary">Personalize my briefs</h3>
            <p className="text-sm text-text-secondary">
              Use your feedback (thumbs up/down, relevance ratings) to customize future briefs for your preferences.
            </p>
          </div>
          <Switch
            checked={personalizeEnabled}
            onCheckedChange={handlePersonalizeToggle}
          />
        </div>

        {/* Data Sharing Setting */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-md">
            <h3 className="font-medium text-text-primary">Share anonymized feedback</h3>
            <p className="text-sm text-text-secondary">
              Help improve Brief.me for everyone by sharing your anonymized feedback patterns with our training models.
            </p>
          </div>
          <Switch
            checked={shareDataEnabled}
            onCheckedChange={handleShareDataToggle}
          />
        </div>

        {/* Reset Personalization */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-start justify-between">
            <div className="space-y-1 max-w-md">
              <h3 className="font-medium text-text-primary">Reset personalization</h3>
              <p className="text-sm text-text-secondary">
                Clear all learned preferences and start fresh. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowResetDialog(true)}
              className="text-text-secondary hover:text-text-primary"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <HelpCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-text-primary">How feedback works</h4>
              <p className="text-sm text-text-secondary mt-1">
                When you rate summaries or mark action items as relevant/irrelevant, Brief.me learns your preferences. 
                This helps us show you more of what matters and less of what doesn't in future briefs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Personalization</DialogTitle>
            <DialogDescription>
              This will clear all learned preferences from your feedback. Brief.me will start fresh 
              and no longer use your previous ratings to customize your briefs. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleResetPersonalization}
              disabled={isResetting}
            >
              {isResetting ? "Resetting..." : "Reset Personalization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackTrainingSection;
