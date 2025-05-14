
import React from "react";
import { Zap } from "lucide-react";

const UrgentThreadsSection = () => {
  const urgentThreads = [
    { channel: "# product", message: "New designs ready for review" },
    { channel: "Sandra", message: "About the quarterly report" }
  ];

  return (
    <div className="p-card-padding">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-heading-md text-text-headline font-medium flex items-center">
          <Zap className="mr-2 h-5 w-5 text-icon" />
          Urgent Threads
        </h2>
        <span className="text-meta text-text-secondary">
          {urgentThreads.length} threads requiring attention
        </span>
      </div>
      <div className="space-y-row-gap">
        {urgentThreads.map((thread, i) => (
          <div 
            key={i} 
            className="px-4 py-3 rounded-md bg-card/50 text-body flex items-center justify-between shadow-card hover:bg-card transition-all duration-200 cursor-pointer"
          >
            <span className="font-medium text-text-headline">{thread.channel}</span>
            <span className="text-text-secondary">{thread.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(UrgentThreadsSection);
