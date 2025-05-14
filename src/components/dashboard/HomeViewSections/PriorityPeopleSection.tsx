
import React from "react";
import { User } from "lucide-react";

const PriorityPeopleSection = () => {
  const priorityPeople = [
    { 
      name: "Sandra Chen", 
      title: "Product Manager", 
      lastActivity: "15m ago", 
      platform: "Email",
      active: true 
    },
    { 
      name: "Alex Johnson", 
      title: "Engineering Lead", 
      lastActivity: "2h ago", 
      platform: "Slack",
      active: true 
    },
    { 
      name: "Michael Lee", 
      title: "CEO", 
      lastActivity: "1d ago", 
      platform: "Calendar",
      active: false 
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-text-primary text-lg flex items-center mb-2">
        <User className="mr-2 h-5 w-5 text-accent-primary" />
        Priority People
      </h2>
      <p className="text-text-secondary text-sm mb-3">
        {priorityPeople.filter(p => p.active).length} people with recent activity
      </p>
      <div className="space-y-1">
        {priorityPeople.map((person, i) => (
          <div key={i} className={`p-2 rounded-lg ${person.active ? "hover:bg-surface-raised/20" : "hover:bg-surface-raised/10"} transition-colors`}>
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center text-text-primary font-medium text-xs">
                {person.name.charAt(0)}
              </div>
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-text-primary">{person.name}</h3>
                  <div className="flex items-center text-xs text-text-secondary">
                    <span>{person.platform}</span>
                    <span className="mx-1">•</span>
                    <span>{person.lastActivity}</span>
                  </div>
                </div>
              </div>
              {person.active && <span className="h-2 w-2 rounded-full bg-accent-primary ml-1"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PriorityPeopleSection);
