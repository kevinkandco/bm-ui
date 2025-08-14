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
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileBottomNav from "@/components/dashboard/MobileBottomNav";
import MobileHeader from "@/components/dashboard/MobileHeader";

const BriefsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [briefs, setBriefs] = useState<Summary[]>([]);
  const [pendingData, setPendingData] = useState<PendingData[]>([]);
  const [loading, setLoading] = useState(false);
  const { call } = useApi();
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    briefModalOpen: false,
  });
  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
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
  };

  const getBriefs = useCallback(
    async (page = 1): Promise<void> => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      const response = await call("get", `/summaries?page=${page}&per_page=8`, {
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
      setLoading(false);
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
            setPendingData(
              (prev) => prev?.filter((d) => d.id !== item.id) ?? []
            );
            setBriefs((prev) =>
              prev ? prev.map((b) => (b.id === item.id ? data : b)) : []
            );
            clearInterval(intervalId);
            intervalIDsRef.current = intervalIDsRef.current.filter(
              (id) => id !== intervalId
            );
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

  const handleOpenBrief = useCallback(
    (briefId: number) => {
      if (!briefId) return;
      navigate(`/dashboard/briefs/${briefId}`);
    },
    [navigate]
  );

  const filteredBriefs = briefs?.filter(
    (brief) =>
      (brief.title?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()) ||
      (brief.summary?.toLowerCase() ?? "").includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <DashboardLayout 
        currentPage="briefs" 
        sidebarOpen={sidebarOpen} 
        onToggleSidebar={handleToggleSidebar}
      >
        <div className={`min-h-screen bg-surface ${isMobile ? 'pb-24' : 'px-4 py-6'}`}>
          {isMobile && <MobileHeader />}
          <div className={!isMobile ? 'px-4 py-6' : 'px-4 pb-6'}>
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
        </div>
        {pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={getBriefs}
          />
        )}
        <ViewErrorMessage open={open} onClose={handleClose} message={message} />
      </DashboardLayout>
      
      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </>
  );
};

export const BriefItemSkeleton = () => {
  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
        <div className="flex items-center flex-1">
          <Archive className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />

          <div className="flex justify-between w-full flex-col sm:flex-row gap-5 sm:gap-0">
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-2 w-2 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-2.5 w-1/3" />
              <Skeleton className="h-2 w-3/4" />
            </div>

            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
        </div>
      </div>
      <Separator className="bg-border-subtle my-1" />
    </>
  );
};

export default BriefsList;
