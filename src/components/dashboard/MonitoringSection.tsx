
import React from "react";
import { Activity, Eye, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MonitoringSection = () => {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-surface-raised/20 rounded-lg border border-border-subtle/20">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm text-text-primary">Monitoring</span>
      </div>
      
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>12 sources</span>
        </div>
        <div className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          <Badge variant="secondary" className="bg-primary-teal/20 text-primary-teal text-xs px-1 py-0">
            3 new
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default MonitoringSection;
