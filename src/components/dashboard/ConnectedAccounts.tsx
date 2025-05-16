
import React, { useState } from "react";
import { Settings, Clock, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface ConnectedAccountsProps {}

const ConnectedAccounts = React.memo(({}: ConnectedAccountsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showNudge, setShowNudge] = useState(true);
  
  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
  };
  
  // Simplified productivity metrics with clearer labels
  const metrics = [
    {
      id: "focus-hours",
      label: "Daily Focus",
      value: "3.5h",
      icon: <Clock className="h-4 w-4 text-accent-primary" />,
      trend: "positive",
      description: "Focus time saved daily"
    },
    {
      id: "meetings-reduced",
      label: "Meetings",
      value: "-25%",
      icon: <Calendar className="h-4 w-4 text-accent-primary" />,
      trend: "negative",
      description: "Reduction in meeting time"
    }
  ];
  
  return (
    <div className="flex justify-end gap-3 py-3">
      {/* Work Pattern Nudge - even more subtle now */}
      {showNudge && (
        <div 
          onClick={() => toast({
            title: "Work Pattern",
            description: "Opening work pattern recommendations"
          })}
          className="flex items-center px-3 py-1.5 bg-surface-overlay/10 backdrop-blur-sm border border-border-subtle rounded-full cursor-pointer hover:bg-surface-overlay/20 transition-colors"
        >
          <Bell className="h-3.5 w-3.5 text-accent-primary mr-1.5" />
          <p className="text-xs text-text-secondary">Break reminder</p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-5 w-5 ml-1.5" 
            onClick={handleDismissNudge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x text-text-secondary"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      )}

      {/* Streamlined Productivity Metrics */}
      <TooltipProvider>
        {metrics.map(metric => (
          <Tooltip key={metric.id}>
            <TooltipTrigger asChild>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${
                metric.trend === 'positive' ? 'border-green-500/20 bg-green-500/10' : 'border-blue-500/20 bg-blue-500/10'
              }`}>
                {metric.icon}
                <span className={`text-sm font-medium ${
                  metric.trend === 'positive' ? 'text-green-500' : 'text-blue-500'
                }`}>
                  {metric.value}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{metric.label}: {metric.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        
        {/* Settings button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenSettings}
          className="h-8 w-8 rounded-full border-border-subtle hover:bg-surface-raised/30"
        >
          <Settings className="h-4 w-4 text-text-primary" />
        </Button>
      </TooltipProvider>
    </div>
  );
});

ConnectedAccounts.displayName = 'ConnectedAccounts';
export default ConnectedAccounts;
