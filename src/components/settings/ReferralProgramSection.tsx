
import React, { useState } from "react";
import { Copy, Mail, Share, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const ReferralProgramSection = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data - would come from API in real implementation
  const username = "alexjohnson";
  const monthsEarned = 0;
  const referralLink = `brief.me/r/${username}`;
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${referralLink}`);
      toast({
        title: "Link Copied",
        description: "Your referral link has been copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const shareText = "Stop doom-scrolling. Get briefed.";
  const shareUrl = `https://${referralLink}`;

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email') => {
    let url = '';
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent('Check out Brief.me')}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
        break;
    }
    
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-text-primary mb-2">Referral Program</h2>
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">✉️</span>
          <p className="text-text-primary font-medium">Invite friends, earn free Brief.me.</p>
        </div>
        <p className="text-text-secondary">
          For every friend who upgrades, we drop a free month of Brief.me into your account. No caps, no catch.
        </p>
      </div>

      {/* Referral Link Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Your link</label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary">
              {referralLink}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="px-3"
            >
              <Copy className="h-4 w-4 mr-1" />
              copy
            </Button>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-text-secondary">Status:</span>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            monthsEarned > 0 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-white/10 text-text-secondary border border-white/20'
          }`}>
            {monthsEarned}/∞ months earned
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Share with friends</label>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-1"
            >
              <span className="font-bold">𝕏</span>
              <span>Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('linkedin')}
              className="flex items-center space-x-1"
            >
              <span className="text-blue-400">in</span>
              <span>LinkedIn</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('email')}
              className="flex items-center space-x-1"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mini-FAQ */}
      <div className="border-t border-border-subtle pt-6">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 h-auto text-left hover:bg-transparent"
            >
              <span className="text-sm font-medium text-text-secondary">Frequently Asked Questions</span>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-text-secondary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-text-secondary" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div>
              <h4 className="font-medium text-text-primary mb-1">When do I get credit?</h4>
              <p className="text-sm text-text-secondary">After your friend's trial ends and they pay for any plan.</p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">How many friends can I invite?</h4>
              <p className="text-sm text-text-secondary">Sky's the limit. There's no cap on referrals or earned months.</p>
            </div>
            <div>
              <h4 className="font-medium text-text-primary mb-1">Does my friend get anything?</h4>
              <p className="text-sm text-text-secondary">Yep—they get an extended 30-day trial to fully experience Brief.me.</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ReferralProgramSection;
