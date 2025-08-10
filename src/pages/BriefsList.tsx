
import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Archive, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";

const BriefsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleOpenBrief = useCallback((briefId: number) => {
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  const briefs = [
    { 
      id: 1, 
      title: "Daily Update - May 14, 2025", 
      date: "Today, 9:00 AM", 
      timeRange: "6:00 AM - 9:00 AM",
      unread: true, 
      summary: "5 emails, 12 messages" 
    },
    { 
      id: 2, 
      title: "Weekly Summary - Week 20", 
      date: "Yesterday, 5:30 PM", 
      timeRange: "Monday - Friday",
      unread: false, 
      summary: "24 emails, 47 messages" 
    },
    { 
      id: 3, 
      title: "Project Milestones - Q2", 
      date: "May 12, 2025", 
      timeRange: "Last 24 hours",
      unread: false, 
      summary: "8 emails, 15 messages" 
    },
    { 
      id: 4, 
      title: "Team Performance Review", 
      date: "May 10, 2025", 
      timeRange: "9:00 AM - 5:00 PM",
      unread: false, 
      summary: "12 emails, 23 messages" 
    },
    { 
      id: 5, 
      title: "Stakeholder Update", 
      date: "May 8, 2025", 
      timeRange: "2:00 PM - 6:00 PM",
      unread: false, 
      summary: "6 emails, 9 messages" 
    },
  ];

  const filteredBriefs = briefs.filter(brief =>
    brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brief.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DashboardLayout 
        currentPage="briefs" 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={handleToggleSidebar}
      >
        <div className={`min-h-screen bg-surface px-4 py-6 ${isMobile ? 'pb-24' : ''}`}>
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
                <BreadcrumbPage>Briefs</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">All Briefs</h1>
            <p className="text-text-secondary">Search and view your brief history</p>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
              <Input
                placeholder="Search briefs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-xl bg-surface-overlay border-border-subtle"
              />
            </div>
          </div>
          
          {/* Briefs List */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-4 md:p-6">
              <div className="space-y-1">
                {filteredBriefs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-text-secondary">No briefs found matching your search.</p>
                  </div>
                ) : (
                  filteredBriefs.map((brief) => (
                    <React.Fragment key={brief.id}>
                      <div 
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                        onClick={() => handleOpenBrief(brief.id)}
                      >
                        <div className="flex items-center flex-1">
                          <Archive className="h-5 w-5 text-accent-primary mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium text-text-primary truncate">{brief.title}</h3>
                              {brief.unread && (
                                <span className="ml-2 h-2 w-2 bg-accent-primary rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">{brief.date}</p>
                            <p className="text-xs text-text-secondary mt-1">Time Range: {brief.timeRange}</p>
                            <p className="text-xs text-text-secondary mt-1">{brief.summary}</p>
                          </div>
                        </div>
                      </div>
                      {brief.id !== filteredBriefs[filteredBriefs.length - 1].id && 
                        <Separator className="bg-border-subtle my-1" />
                      }
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </>
  );
};

export default BriefsList;
