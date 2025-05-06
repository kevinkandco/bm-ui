
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
      <h2 className="text-deep-teal text-lg flex items-center mb-2">
        <User className="mr-2 h-5 w-5 text-glass-blue" />
        Priority People
      </h2>
      <p className="text-deep-teal/80 text-sm mb-3">
        {priorityPeople.filter(p => p.active).length} people with recent activity
      </p>
      <div className="space-y-1">
        {priorityPeople.map((person, i) => (
          <div key={i} className={`p-2 rounded-lg ${person.active ? "hover:bg-white/20" : "hover:bg-white/10"} transition-colors`}>
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-white/70 border border-white/50 flex items-center justify-center text-deep-teal font-medium text-xs">
                {person.name.charAt(0)}
              </div>
              <div className="ml-2 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-deep-teal">{person.name}</h3>
                  <div className="flex items-center text-xs text-deep-teal/70">
                    <span>{person.platform}</span>
                    <span className="mx-1">•</span>
                    <span>{person.lastActivity}</span>
                  </div>
                </div>
              </div>
              {person.active && <span className="h-2 w-2 rounded-full bg-glass-blue ml-1"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PriorityPeopleSection);
