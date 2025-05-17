
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Http from "@/Http";
import { Button } from "@/components/ui/button";
import { Clock, Zap, X } from "lucide-react";
interface BriefsFeedProps {
  onOpenBrief: (briefId: number) => void;
  onCatchMeUp: () => void;
  onFocusMode: () => void;
}

const BaseURL = import.meta.env.VITE_API_HOST;

interface Stats {
  emails?: number;
  messages?: number;
  meetings?: number;
}

interface Summary {
  id: number;
  user_id: number;
  summary: string;
  audio_path: string;
  created_at: string;
  title?: string;
  description?: string;
  timestamp?: string;
  stats?: Stats;
}

const BriefsFeed = React.memo(({ onOpenBrief }: BriefsFeedProps) => {
  // Sample briefs data - in a real app this would come from a data source

  const [briefs, setBriefs] = useState<Summary[] | null>(null);
    const [loading, setLoading] = useState(true);
  
  // const briefs = useMemo(() => [
  //   {
  //     id: 1,
  //     title: "Morning Brief",
  //     description: "Quick summary of your morning updates",
  //     timestamp: "Today, 8:00 AM",
  //     stats: {
  //       emails: 5,
  //       messages: 12,
  //       meetings: 1
  //     }
  //   },
  //   {
  //     id: 2,
  //     title: "Slack Channel Updates",
  //     description: "New messages in #team-updates channel",
  //     timestamp: "Today, 10:30 AM",
  //     stats: {
  //       emails: 0,
  //       messages: 8,
  //       meetings: 0
  //     }
  //   },
  //   {
  //     id: 3,
  //     title: "Weekly Summary",
  //     description: "Your week at a glance",
  //     timestamp: "Yesterday, 5:00 PM",
  //     stats: {
  //       emails: 24,
  //       messages: 47,
  //       meetings: 5
  //     }
  //   },
  //   {
  //     id: 4,
  //     title: "Project Deadline Reminders",
  //     description: "Upcoming project milestones this week",
  //     timestamp: "2 days ago",
  //     stats: {
  //       emails: 2,
  //       messages: 5,
  //       meetings: 2
  //     }
  //   }
  // ], []);


    const getBriefs = useCallback(async (): Promise<void> => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No authorization token found");
          return;
        }
        Http.setBearerToken(token);
        const response = await Http.callApi(
          "get",
          `${BaseURL}/api/summaries`,
          null,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (response) {
          setBriefs(response?.data?.summaries?.data);
          setLoading(false);
        } else {
          console.error("Failed to fetch summaries data");
          setLoading(false);
        }
      } catch (error) {
          setLoading(false);
        console.error("Error fetching summaries data:", error);
      }
    }, []);

    useEffect(() => {
      getBriefs();
    }, [getBriefs]);

  const handleOpenBrief = (briefId: number) => {
    onOpenBrief(briefId);
  };

const handleGenerateSummary = async () => {
  try {
    setLoading(true);
    console.log(loading, 1);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authorization token found");
      setLoading(false);
      return;
    }

    Http.setBearerToken(token);
    const payload = {
      messages: "testing message",
    };

    const response = await Http.callApi(
      "post",
      `${BaseURL}/api/generate-summary`,
      payload
    );

    if (response) {
      console.log(loading, 2);
      console.log(response, "response");
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    setLoading(false); 
  }
};


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Your Brief Feed</h2>
        <Button onClick={handleGenerateSummary} className="bg-blue-600 text-white hover:bg-blue-700">
          <Zap className="mr-2 h-4 w-4" /> Generate Summary
             {loading && (
             <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
             )}
        </Button>
      </div>
      <p className="text-text-secondary mt-1 mb-4">Stay updated with your latest briefs</p>

      
      <div className="divide-y divide-border-subtle">
        {briefs?.map((brief) => (
          <div 
            key={brief.id}
            className="py-6 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-md px-3" 
            onClick={() => handleOpenBrief(brief.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-primary text-lg font-medium">{brief.title || 'Slack Channel Updates'}</h3>
              <span className="text-sm text-text-secondary">{brief.timestamp || '2 days ago'}</span>
            </div>
            <p className="text-text-secondary mb-4 text-sm">{brief.description || 'Upcoming project milestones this week'}</p>
            <div className="flex flex-wrap gap-4 items-center">
              {brief?.stats?.emails > 0 && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.emails || '2'} emails</span>
                </div>
              )}
              
              {brief?.stats?.messages > 0 && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.messages || '4'} messages</span>
                </div>
              )}
              
              {brief?.stats?.meetings > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.meetings || '9'} meetings</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

BriefsFeed.displayName = 'BriefsFeed';
export default BriefsFeed;
