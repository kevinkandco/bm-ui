
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
    <div className="p-card-padding">
      <h2 className="text-heading-md text-text-headline flex items-center mb-2">
        <User className="mr-2 h-5 w-5 text-icon" />
        Priority People
      </h2>
      <p className="text-body text-text-secondary mb-4">
        {priorityPeople.filter(p => p.active).length} people with recent activity
      </p>
      <div className="space-y-1">
        {priorityPeople.map((person, i) => (
          <div key={i} className={`p-2 rounded-md ${person.active ? "hover:bg-card/30" : "hover:bg-card/20"} transition-all duration-200`}>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-card flex items-center justify-center text-text-headline font-medium text-sm">
                {person.name.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-body font-medium text-text-headline">{person.name}</h3>
                  <div className="flex items-center text-xs text-text-secondary">
                    <span>{person.platform}</span>
                    <span className="mx-1">•</span>
                    <span>{person.lastActivity}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary">{person.title}</p>
              </div>
              {person.active && <span className="h-2 w-2 rounded-full bg-accent-blue ml-1"></span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(PriorityPeopleSection);
