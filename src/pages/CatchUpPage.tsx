
import React from "react";
import { Zap, RefreshCw, Clock, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const CatchUpPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRefreshSummary = () => {
    toast({
      title: "Refreshing",
      description: "Generating a new catch-up summary",
    });
  };

  const updates = [
    {
      id: 1,
      category: "Important Messages",
      items: [
        {
          id: 101,
          title: "Client feedback on proposal",
          source: "Email - John Carter",
          time: "10:30 AM",
          content: "The client has reviewed our proposal and requested some changes to the pricing structure. They're positive overall but want to discuss a few points."
        },
        {
          id: 102,
          title: "Team meeting rescheduled",
          source: "Calendar",
          time: "9:15 AM",
          content: "The weekly team meeting has been moved from Tuesday to Wednesday 10:00 AM due to scheduling conflicts."
        }
      ]
    },
    {
      id: 2,
      category: "Project Updates",
      items: [
        {
          id: 201,
          title: "New milestone reached on Project X",
          source: "Slack - Project X channel",
          time: "Yesterday",
          content: "The development team has completed the backend integration ahead of schedule. Testing will begin tomorrow."
        },
        {
          id: 202,
          title: "Design assets ready for review",
          source: "Figma notification",
          time: "Yesterday",
          content: "The design team has finalized the UI components and they're ready for developer handoff."
        }
      ]
    },
    {
      id: 3,
      category: "Priority People",
      items: [
        {
          id: 301,
          title: "Message from CEO",
          source: "Internal Memo",
          time: "This morning",
          content: "The CEO has announced a company-wide meeting for next Monday to discuss the quarterly results and upcoming strategic initiatives."
        },
        {
          id: 302,
          title: "Team lead feedback",
          source: "Slack - Direct Message",
          time: "Yesterday",
          content: "Your team lead has provided feedback on your recent project contribution, mentioning your excellent problem-solving approach."
        }
      ]
    }
  ];

  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate("/dashboard")} 
                className="cursor-pointer"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Catch Me Up</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary flex items-center">
              <Zap className="mr-3 h-6 w-6 text-accent-primary" />
              Catch Me Up
            </h1>
            <p className="text-text-secondary mt-1">
              Quick summary of what you've missed since yesterday
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              onClick={handleRefreshSummary}
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Refresh Summary
            </Button>
          </div>
        </div>
        
        <div className="mb-8 glass-card rounded-3xl p-6">
          <div className="flex items-center mb-4">
            <Clock className="mr-2 h-5 w-5 text-accent-primary" />
            <h2 className="text-xl font-semibold text-text-primary">Last updated: Today, 11:35 AM</h2>
          </div>
          
          <p className="text-text-secondary mb-4">
            Here's what you missed while you were away. I've prioritized important messages, project updates, 
            and notifications from your priority people.
          </p>
          
          <div className="flex space-x-4 mt-4">
            <Button size="sm" variant="ghost" className="flex items-center">
              <ThumbsUp className="mr-2 h-4 w-4" /> Helpful
            </Button>
            <Button size="sm" variant="ghost" className="flex items-center">
              <ThumbsDown className="mr-2 h-4 w-4" /> Not Helpful
            </Button>
          </div>
        </div>

        {updates.map((category) => (
          <div key={category.id} className="mb-6 glass-card rounded-3xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">{category.category}</h2>
              
              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <h3 className="font-medium text-text-primary">{item.title}</h3>
                    <div className="flex items-center text-sm text-text-secondary mt-1 mb-3">
                      <span>{item.source}</span>
                      <span className="mx-2">•</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-text-secondary">{item.content}</p>
                  </div>
                ))}
              </div>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
};

export default CatchUpPage;
