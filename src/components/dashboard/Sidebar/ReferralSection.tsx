
import React from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReferralSection = () => {
  return (
    <div>
      <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
        <Gift className="h-4 w-4" />
        Give a month, get a month
      </h3>
      <div className="p-3 rounded-lg bg-gradient-to-r from-primary-teal/20 to-accent-green/20 border border-primary-teal/30">
        <p className="text-xs text-text-secondary mb-2">
          Refer friends and get a free month for each successful referral!
        </p>
        <Button size="sm" className="w-full bg-primary-teal hover:bg-accent-green text-xs">
          Share Referral Link
        </Button>
      </div>
    </div>
  );
};

export default ReferralSection;
