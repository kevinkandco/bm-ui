import React, { useCallback, useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { CheckSquare, Clock, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { extractGmailNameOnly } from "@/lib/utils";
import Pagination from "@/components/dashboard/Pagination";
import { useToast } from "@/hooks/use-toast";

interface IGmail_data {
  id: number;
  from: string;
  received_at: string;
  snippet: string;
  subject: string;
}

interface ISlack_data {
  id: number;
  name: string | null;
  email: string | null;
  sender: string;
  sent_at: string;
  text: string;
  created_at: string;
}

interface IFollowUps {
  id: number;
  title: string;
  message: string;
  platform: string;
  status: boolean;
  vote: boolean;
  priority: string;
  tag: string;
  redirect_link: string;
  gmail_data: IGmail_data | null;
  slack_data: ISlack_data;
  created_at: string;
}

const FollowUps = () => {
  const { call } = useApi();
  const { toast } = useToast();
  const [followUps, setFollowUps] = useState<IFollowUps[]>([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState<number | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });

  const getActionItems = useCallback(async (page = 1) => {
    const response = await call("get", `/action-items?par_page=10&page=${page}`, {
      showToast: true,
      toastTitle: "Failed to Action Items",
      toastDescription: "Something went wrong getting action items.",
      returnOnFailure: false,
    });

    if (!response && !response.data) return;

    setPagination((prev) => ({
      ...prev,
      currentPage: response?.meta?.current_page || 1,
      totalPages: response?.meta?.last_page || 1,
    }));
    setFollowUps(response?.data || []);
  }, [call]);
  
  useEffect(() => {
    getActionItems();
  }, [getActionItems]);

  const selectedItem = followUps.find(item => item.id === selectedFollowUp);

  const handleMarkComplete = async (item: IFollowUps) => {
    const response = await call("post", `/action-item/update`, {
      body: {
        id: selectedItem?.id,
        platform: selectedItem?.platform,
        status: true
      },
        showToast: true,
        toastTitle: "Failed to Mark Done",
        toastDescription: "Something went wrong. Please try again.",
        returnOnFailure: false,
    });

    if (!response && !response.data) return;

    setFollowUps(followUps.map(followUp => followUp.id === item.id ? {...followUp, status: true} : followUp));

    toast({
      title: "Action Item Completed",
      description: `"${selectedItem?.title}" marked as done`,
      action: <Button size="sm" variant="outline" onClick={async () => {
            const response = await call("post", `/action-item/update`, {
            body: {
              id: selectedItem?.id,
              platform: selectedItem?.platform,
              status: false
            },
              showToast: true,
              toastTitle: "Failed to Mark Done",
              toastDescription: "Something went wrong. Please try again.",
              returnOnFailure: false,
          });

          if (!response && !response.data) return;

          setFollowUps(followUps.map(followUp => followUp.id === item.id ? {...followUp, status: false} : followUp));
      }}>
          Undo
        </Button>
    });
  };

  const handleSnooze = (id: number) => {
    // This would typically snooze the item
    console.log(`Snoozing follow-up ${id}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-text-secondary';
    }
  };

  const getBadgeColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'text-red-400';
      case 'decision': return 'text-yellow-400';
      case 'approval': return 'text-green-400';
      default: return 'text-text-secondary';
    }
  };


  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'completed': return 'text-green-400';
  //     case 'pending': return 'text-yellow-400';
  //     case 'overdue': return 'text-red-400';
  //     default: return 'text-text-secondary';
  //   }
  // };
  const getStatusColor = (status: boolean) => {
    switch (status) {
      case true: return 'text-green-400';
      case false: return 'text-yellow-400';
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
                key={item.platform + item.id}
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
                      item.status ? 'text-green-400' : 'text-text-secondary'
                    }`} 
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-text-primary text-sm truncate">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-xs mt-1 line-clamp-2">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap capitalize">
                      <span className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      {/* <span className="text-xs text-text-secondary">
                        {item.}
                      </span> */}
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
                      <span>From {selectedItem?.platform === 'gmail' ? extractGmailNameOnly(selectedItem.gmail_data?.from) : selectedItem?.slack_data?.sender}</span>
                    </div>
                    {/* <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Due {selectedItem?.status}</span>
                    </div> */}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span className={getStatusColor(selectedItem.status)}>
                        {selectedItem.status ? "Completed" : "Pending"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2">
                  {!selectedItem.status && (
                    <>
                      <Button
                        onClick={() => handleMarkComplete(selectedItem)}
                        className="bg-primary-teal hover:bg-primary-teal/90 text-sm md:text-base"
                        size="sm"
                      >
                        Mark Complete
                      </Button>
                      {/* <Button
                        onClick={() => handleSnooze(selectedItem.id)}
                        variant="outline"
                        className="border-border-subtle text-sm md:text-base"
                        size="sm"
                      >
                        Snooze
                      </Button> */}
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(selectedItem.tag)} bg-white/10`}>
                  {selectedItem.tag}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base md:text-lg font-medium text-text-primary mb-3">Details</h3>
                <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                  {selectedItem.message}
                </p>
              </div>

              {/* Original Message */}
              <div>
                <h3 className="text-base md:text-lg font-medium text-text-primary mb-3">Original Message</h3>
                <div className="bg-white/5 rounded-lg p-3 md:p-4 border-l-4 border-primary-teal">
                  <p className="text-text-secondary italic text-sm md:text-base">
                    "{selectedItem?.platform === "gmail" ? selectedItem.gmail_data?.snippet : selectedItem?.slack_data?.text}"
                  </p>
                  <p className="text-text-secondary text-xs md:text-sm mt-2">
                    Sent via {selectedItem?.platform} 
                  </p>
                </div>
              </div>

              {/* Actions */}
              {selectedItem.status && (
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
      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={getActionItems}
        />
      )}
    </AppLayout>
  );
};

export default FollowUps;