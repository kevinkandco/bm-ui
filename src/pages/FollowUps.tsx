import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { CheckSquare, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const FollowUps = () => {
  const [selectedFollowUp, setSelectedFollowUp] = useState<number | null>(1);

  const followUps = [
    {
      id: 1,
      title: "Review Q2 Marketing Budget",
      description: "Sarah requested feedback on the Q2 marketing budget proposal",
      assignedBy: "Sarah Chen",
      dueDate: "Today, 3:00 PM",
      priority: "High",
      status: "pending",
      details: "Sarah has submitted the Q2 marketing budget proposal and needs your review by end of day. The proposal includes increased digital advertising spend and new campaign initiatives.",
      originalMessage: "Hey, can you take a look at the Q2 marketing budget when you have a chance? I need your feedback before the board meeting tomorrow.",
      context: "Sent via Slack in #marketing-planning"
    },
    {
      id: 2,
      title: "Schedule Team Performance Reviews",
      description: "HR reminder to schedule quarterly performance reviews",
      assignedBy: "HR System",
      dueDate: "Tomorrow, 5:00 PM",
      priority: "Medium",
      status: "pending",
      details: "Quarterly performance reviews are due for your direct reports: Alex, Jamie, and Morgan. Please schedule 1-hour sessions with each team member.",
      originalMessage: "Reminder: Q1 performance reviews are due this week. Please schedule sessions with your direct reports.",
      context: "Email from HR system"
    },
    {
      id: 3,
      title: "Client Presentation Feedback",
      description: "John needs input on the client presentation for Friday",
      assignedBy: "John Miller",
      dueDate: "May 16, 2025",
      priority: "Medium",
      status: "completed",
      details: "John has prepared the client presentation for the ABC Corp meeting and would like your input on the technical sections.",
      originalMessage: "Could you review slides 15-25 of the client presentation? I want to make sure the technical details are accurate.",
      context: "Sent via email"
    }
  ];

  const selectedItem = followUps.find(item => item.id === selectedFollowUp);

  const handleMarkComplete = (id: number) => {
    // This would typically update the item status
    console.log(`Marking follow-up ${id} as complete`);
  };

  const handleSnooze = (id: number) => {
    // This would typically snooze the item
    console.log(`Snoozing follow-up ${id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-text-secondary';
    }
  };

  return (
    <AppLayout currentPage="follow-ups">
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-6 md:h-full">
        {/* Mobile Header */}
        <div className="md:hidden mb-4">
          <h2 className="text-xl font-semibold text-text-primary mb-1">Follow-ups</h2>
          <p className="text-text-secondary text-sm">Items requiring your attention</p>
        </div>

        {/* Left Column - Follow-ups List */}
        <div className="md:col-span-1 space-y-4 md:h-full md:overflow-auto">
          <div className="mb-4 hidden md:block">
            <h2 className="text-xl font-semibold text-text-primary mb-2">Follow-ups</h2>
            <p className="text-text-secondary text-sm">Items requiring your attention</p>
          </div>
          
          <div className="space-y-2">
            {followUps.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedFollowUp(item.id)}
                className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all ${
                  selectedFollowUp === item.id
                    ? 'bg-white/10 border border-primary-teal/30'
                    : 'bg-white/5 hover:bg-white/8 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <CheckSquare 
                    className={`w-4 h-4 mt-1 flex-shrink-0 ${
                      item.status === 'completed' ? 'text-green-400' : 'text-text-secondary'
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary text-sm truncate">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-xs mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {item.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Follow-up Details */}
        <div className="md:col-span-3 card-dark p-4 md:p-6">
          {selectedItem ? (
            <div className="space-y-4 md:space-y-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-lg md:text-2xl font-semibold text-text-primary mb-2">
                    {selectedItem.title}
                  </h1>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>From {selectedItem.assignedBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Due {selectedItem.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className={getStatusColor(selectedItem.status)}>
                        {selectedItem.status.charAt(0).toUpperCase() + selectedItem.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2">
                  {selectedItem.status !== 'completed' && (
                    <>
                      <Button
                        onClick={() => handleMarkComplete(selectedItem.id)}
                        className="bg-primary-teal hover:bg-primary-teal/90 text-sm md:text-base"
                        size="sm"
                      >
                        Mark Complete
                      </Button>
                      <Button
                        onClick={() => handleSnooze(selectedItem.id)}
                        variant="outline"
                        className="border-border-subtle text-sm md:text-base"
                        size="sm"
                      >
                        Snooze
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Priority Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-secondary">Priority:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedItem.priority)} bg-white/10`}>
                  {selectedItem.priority}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base md:text-lg font-medium text-text-primary mb-3">Details</h3>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                  {selectedItem.details}
                </p>
              </div>

              {/* Original Message */}
              <div>
                <h3 className="text-base md:text-lg font-medium text-text-primary mb-3">Original Message</h3>
                <div className="bg-white/5 rounded-lg p-3 md:p-4 border-l-4 border-primary-teal">
                  <p className="text-text-secondary italic text-sm md:text-base">
                    "{selectedItem.originalMessage}"
                  </p>
                  <p className="text-text-secondary text-xs md:text-sm mt-2">
                    {selectedItem.context}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedItem.status !== 'completed' && (
                <div className="pt-4 border-t border-border-subtle">
                  <h3 className="text-base md:text-lg font-medium text-text-primary mb-3">Quick Actions</h3>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                    <Button variant="outline" className="border-border-subtle text-sm" size="sm">
                      Reply
                    </Button>
                    <Button variant="outline" className="border-border-subtle text-sm" size="sm">
                      Delegate
                    </Button>
                    <Button variant="outline" className="border-border-subtle text-sm" size="sm">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 md:h-full">
              <div className="text-center">
                <CheckSquare className="w-8 h-8 md:w-12 md:h-12 text-text-secondary mx-auto mb-4" />
                <h3 className="text-base md:text-lg font-medium text-text-primary mb-2">
                  Select a Follow-up
                </h3>
                <p className="text-text-secondary text-sm md:text-base">
                  Choose an item from the left to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default FollowUps;