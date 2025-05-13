
import React from "react";
import { Zap } from "lucide-react";

const UrgentThreadsSection = () => {
  const urgentThreads = [
    { channel: "# product", message: "New designs ready for review" },
    { channel: "Sandra", message: "About the quarterly report" }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-text-primary text-lg font-medium flex items-center">
          <Zap className="mr-2 h-5 w-5 text-accent-primary" />
          Urgent Threads
        </h2>
        <span className="text-text-secondary text-sm">
          {urgentThreads.length} threads requiring your attention
        </span>
      </div>
      <div className="space-y-2 mt-4">
        {urgentThreads.map((thread, i) => (
          <div 
            key={i} 
            className="px-4 py-3 rounded-lg bg-surface-raised/20 border border-border-subtle text-sm flex items-center justify-between shadow-subtle hover:shadow-glow hover:border-border-subtle/50 transition-all cursor-pointer"
          >
            <span className="font-medium text-text-primary">{thread.channel}</span>
            <span className="text-text-secondary">{thread.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(UrgentThreadsSection);
