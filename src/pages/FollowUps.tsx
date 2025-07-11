import React, { useState } from "react";
import { ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/layout/AppLayout";

// Mock follow up data
const followUps = [
  {
    id: 1,
    title: "AlphaSignal",
    type: "Suggested deal",
    stage: "Lead",
    owner: "Kevin Kirkpatrick",
    company: "AlphaSignal",
    summary: "The relationship with AlphaSignal is currently in the 'Lead' stage, with Kevin Kirkpatrick from Uprise actively communicating with Lior Alexander. They are discussing the potential launch of a job board to evaluate their collaboration.",
    blockers: "Lior has expressed that they currently only have a consultant helping with the business side, indicating a lack of internal resources to move forward. There is also a need for clarity on budget and timeline, which has not yet been established.",
    notes: "Kevin is looking to scope out the job board project first before deciding on a more formal role. There is an ongoing dialogue about compensation structures and performance milestones, which may impact the pace of decision-making.",
    people: [
      { name: "Lior Alexander", email: "lior@alphasignal.com" },
      { name: "40798421@bcc.hubspot.com", email: "40798421@bcc.hubspot.com" }
    ],
    createdAt: "15 days ago",
    priority: "high"
  },
  {
    id: 2,
    title: "Document Upload Request",
    type: "Action Item",
    from: "Kellen Thayer",
    subject: "Urgent: Launch Materials Review Needed",
    message: "Kellen Thayer requests you to upload your Betterment and Investment360 statements to the RC Vault.",
    relevance: "Critical - blocking marketing team progress",
    actionReason: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
    source: "Gmail",
    due: "2 PM today",
    createdAt: "7/7/2025, 7:00:30 AM",
    lastActivity: "7/7/2025, 6:43:42 PM",
    priority: "high",
    status: "new"
  },
  {
    id: 3,
    title: "Q4 Planning Session",
    type: "Meeting Follow-up",
    company: "Internal",
    summary: "Follow up on Q4 planning decisions and resource allocation discussed in yesterday's leadership meeting.",
    priority: "medium",
    createdAt: "2 days ago"
  }
];

export default function FollowUps() {
  const [selectedFollowUp, setSelectedFollowUp] = useState(followUps[0]);
  const { toast } = useToast();

  const handleFollowUpClick = (followUp: any) => {
    setSelectedFollowUp(followUp);
  };

  const handleMarkDone = () => {
    toast({
      title: "Marked as Done",
      description: `"${selectedFollowUp.title}" has been marked as complete`,
    });
  };

  const handleOpenExternal = () => {
    toast({
      title: "Opening External",
      description: "Would open in external application",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full gap-6">
        {/* Left Column - Follow Ups List */}
        <div className="w-1/3 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Follow Ups</h2>
            <Badge variant="secondary" className="bg-primary-teal/10 text-primary-teal border-primary-teal/20">
              {followUps.length} items
            </Badge>
          </div>

          <div className="space-y-3">
            {followUps.map((followUp) => (
              <div
                key={followUp.id}
                onClick={() => handleFollowUpClick(followUp)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:border-primary-teal/40 ${
                  selectedFollowUp.id === followUp.id
                    ? 'border-primary-teal/60 bg-primary-teal/5'
                    : 'border-border-muted bg-surface-raised/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-white text-sm">{followUp.title}</h3>
                  <Badge className={`text-xs ${getPriorityColor(followUp.priority)}`}>
                    {followUp.priority}
                  </Badge>
                </div>
                <p className="text-xs text-light-gray-text mb-2">{followUp.type}</p>
                {followUp.company && (
                  <p className="text-xs text-light-gray-text mb-2">Company: {followUp.company}</p>
                )}
                {followUp.from && (
                  <p className="text-xs text-light-gray-text mb-2">From: {followUp.from}</p>
                )}
                <p className="text-xs text-light-gray-text">{followUp.createdAt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Follow Up Details */}
        <div className="flex-1 border-l border-border-muted pl-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{selectedFollowUp.title}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {selectedFollowUp.type}
                  </Badge>
                  {selectedFollowUp.stage && (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                      {selectedFollowUp.stage}
                    </Badge>
                  )}
                  {selectedFollowUp.status && (
                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                      {selectedFollowUp.status}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleOpenExternal}
                  variant="outline" 
                  size="sm"
                  className="border-primary-teal/20 text-primary-teal hover:bg-primary-teal/10"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open External
                </Button>
                <Button 
                  onClick={handleMarkDone}
                  size="sm"
                  className="bg-primary-teal hover:bg-primary-teal/80 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark Done
                </Button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                {selectedFollowUp.from && (
                  <div>
                    <label className="text-sm text-light-gray-text">From</label>
                    <p className="text-white">{selectedFollowUp.from}</p>
                  </div>
                )}
                {selectedFollowUp.owner && (
                  <div>
                    <label className="text-sm text-light-gray-text">Owner</label>
                    <p className="text-white">{selectedFollowUp.owner}</p>
                  </div>
                )}
                {selectedFollowUp.company && (
                  <div>
                    <label className="text-sm text-light-gray-text">Company</label>
                    <p className="text-white">{selectedFollowUp.company}</p>
                  </div>
                )}
                {selectedFollowUp.due && (
                  <div>
                    <label className="text-sm text-light-gray-text">Due</label>
                    <p className="text-red-400 font-medium">{selectedFollowUp.due}</p>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-light-gray-text">Created</label>
                  <p className="text-white">{selectedFollowUp.createdAt}</p>
                </div>
                {selectedFollowUp.lastActivity && (
                  <div>
                    <label className="text-sm text-light-gray-text">Last Activity</label>
                    <p className="text-white">{selectedFollowUp.lastActivity}</p>
                  </div>
                )}
                {selectedFollowUp.source && (
                  <div>
                    <label className="text-sm text-light-gray-text">Source</label>
                    <p className="text-white">{selectedFollowUp.source}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {selectedFollowUp.summary && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
                <p className="text-light-gray-text leading-relaxed">{selectedFollowUp.summary}</p>
              </div>
            )}

            {/* Subject & Message */}
            {selectedFollowUp.subject && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Subject</h3>
                <p className="text-white font-medium mb-4">{selectedFollowUp.subject}</p>
                {selectedFollowUp.message && (
                  <div className="bg-surface-raised/30 p-4 rounded-lg border border-border-muted">
                    <p className="text-light-gray-text">{selectedFollowUp.message}</p>
                  </div>
                )}
              </div>
            )}

            {/* Blockers */}
            {selectedFollowUp.blockers && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Blockers</h3>
                <p className="text-light-gray-text leading-relaxed">{selectedFollowUp.blockers}</p>
              </div>
            )}

            {/* Notes */}
            {selectedFollowUp.notes && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                <p className="text-light-gray-text leading-relaxed">{selectedFollowUp.notes}</p>
              </div>
            )}

            {/* Relevance & Action Reason */}
            {selectedFollowUp.relevance && (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Relevance</h3>
                  <p className="text-red-400">{selectedFollowUp.relevance}</p>
                </div>
                {selectedFollowUp.actionReason && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Why this is an action item</h3>
                    <p className="text-light-gray-text">{selectedFollowUp.actionReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* People */}
            {selectedFollowUp.people && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">People</h3>
                <div className="space-y-2">
                  {selectedFollowUp.people.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-surface-raised/30 rounded-lg border border-border-muted">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-teal/20 text-primary-teal text-xs">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm font-medium">{person.name}</p>
                        <p className="text-light-gray-text text-xs">{person.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}