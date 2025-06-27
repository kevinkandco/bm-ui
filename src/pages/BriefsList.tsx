import React, { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Archive, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Summary } from "@/components/dashboard/types";
import Pagination from "@/components/dashboard/Pagination";
import { useApi } from "@/hooks/useApi";
import { PendingData } from "./Dashboard";
import ViewErrorMessage from "@/components/dashboard/ViewErrorMessage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const BriefsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [briefs, setBriefs] = useState<Summary[]>([]);
  const [pendingData, setPendingData] = useState<PendingData[]>([]);
  const { call } = useApi();
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    briefModalOpen: false
  });
  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // const handleOpenBrief = useCallback((briefId: number) => {
  //   setSelectedBrief(briefId);
  //   setBriefModalOpen(true);
  // }, []);

  // const handleCloseBriefModal = useCallback(() => {
  //   setBriefModalOpen(false);
  //   setSelectedBrief(null);
  // }, []);

  const handleClick = (message: string) => {
    if (!message) return;
    setMessage(message);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  }

  const getBriefs = useCallback(
    async (page = 1): Promise<void> => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      const response = await call("get", `/summaries?page=${page}`, {
        showToast: true,
        toastTitle: "Failed to fetch summaries",
        toastDescription: "Unable to load briefs. Please try again.",
      });

      if (response?.data && Array.isArray(response.data)) {
        setBriefs(response.data);
        setPagination((prev) => ({
          ...prev,
          currentPage: response?.meta?.current_page || 1,
          totalPages: response?.meta?.last_page || 1,
        }));
      } else {
        setBriefs([]);
      }
    },
    [call]
  );

  const getBrief = useCallback(
    async (briefId: number): Promise<false | Summary> => {
      const response = await call("get", `/summary/${briefId}/status`, {
        showToast: true,
        toastTitle: "Failed to fetch brief",
        toastDescription: "Something went wrong while fetching the brief.",
        returnOnFailure: false, 
      });

      if (!response?.data) return false;

      const status = response.data.status;
      if (status === "success" || status === "failed") {
        return response.data;
      }
      return false;
    },
    [call]
  );

  useEffect(() => {
    getBriefs(1);
  }, [getBriefs]);

  useEffect(() => {
    if (!briefs) return;

    const newPending = briefs
      ?.filter(
        (brief) => brief.status !== "success" && brief.status !== "failed"
      )
      .map((brief) => ({ id: brief.id, status: true }));

    setPendingData(newPending);
  }, [briefs, setPendingData]);

  useEffect(() => {
    intervalIDsRef.current.forEach((id) => id && clearInterval(id));
    intervalIDsRef.current = [];

    if (!pendingData?.length) return;

    const ids = pendingData.map((item) => {
      const intervalId = setInterval(async () => {
        try {
          const data = await getBrief(item.id);
          if (data) {
            setPendingData((prev) => prev?.filter((d) => d.id !== item.id) ?? []);
            setBriefs((prev) =>
              prev ? prev.map((b) => (b.id === item.id ? data : b)) : []
            );
            clearInterval(intervalId);
            intervalIDsRef.current = intervalIDsRef.current.filter((id) => id !== intervalId);
          }
        } catch (error) {
          console.error(`Error polling brief ${item.id}:`, error);
        }
      }, 3000);
      return intervalId;
    });

    intervalIDsRef.current = ids;

    return () => {
      intervalIDsRef.current.forEach((id) => clearInterval(id));
      intervalIDsRef.current = [];
    };
  }, [pendingData, getBrief]);

  const handleOpenBrief = useCallback((briefId: number) => {
    if (!briefId) return;
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  const filteredBriefs = briefs?.filter((brief) =>
    (brief.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
    (brief.summary?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout 
      currentPage="briefs" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="min-h-screen bg-surface px-4 py-6">
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

              {filteredBriefs?.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-text-secondary">No briefs found matching your search.</p>
                </div>
              ) : (
                filteredBriefs?.map((brief, index) => {
                  const { id, title, status, summaryTime, start_at, ended_at, emailCount, slackMessageCount, error } = brief;

                  const timeRange = start_at && ended_at ? `Time Range: ${start_at} - ${ended_at}` : "";
                  const isClickable = status === "success" || status === "failed";

                  return (
                    <React.Fragment key={brief.id}>
                      <div 
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                        onClick={isClickable ? () => handleOpenBrief(id) : undefined}
                      >
                        <div className="flex items-center flex-1">
                          <Archive className="h-5 w-5 text-accent-primary mr-3 flex-shrink-0" />

                          <div className="flex justify-between w-full flex-col sm:flex-row gap-5 sm:gap-0"> 
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center">
                              <h3 className="font-medium text-text-primary truncate">{title}</h3>
                              {!brief?.read_at && (
                                <span className="ml-2 h-2 w-2 bg-accent-primary rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-sm text-text-secondary">{summaryTime}</p>
                            {timeRange && <p className="text-xs text-text-secondary mt-1">{timeRange}</p>}
                            <p className="text-xs text-text-secondary mt-1">{`${emailCount ? `${emailCount} emails` : "0 email"}, ${slackMessageCount ? `${slackMessageCount} slack messages` : "0 slack messages"}`}</p>
                          </div>
                          <div>
                            {(status !== "failed" && status !== "success")  && (
                              <span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-yellow-500 text-yellow-500">
                                Generating summary
                              </span>
                            )}
                            {status === "failed" && (
                              <span onClick={(e) => {
                                e.stopPropagation();
                                handleClick(error);
                              }} className="text-sm text-text-secondary border px-2 py-1 rounded-md border-red-500 text-red-500">
                                Failed to generate the summary
                              </span>
                            )}
                          </div>
                          </div>
                          {/* <p className="text-sm text-text-secondary">{brief.date}</p> */}
                        </div>
                      </div>
                    {index + 1 !== briefs.length && <Separator className="bg-border-subtle my-1" />}
                  </React.Fragment>
                )
                }))}
            </div>
          </div>
        </div>
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={getBriefs}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default BriefsList;
