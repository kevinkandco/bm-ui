import React, { useCallback, useEffect, useRef, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Archive, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Summary } from "@/components/dashboard/types";
import Pagination from "@/components/dashboard/Pagination";
import BriefModal from "@/components/dashboard/BriefModal";
import { useApi } from "@/hooks/useApi";
import { PendingData } from "./Dashboard";
import ViewErrorMessage from "@/components/dashboard/ViewErrorMessage";


const BriefsList = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [briefs, setBriefs] = useState<Summary[] | null>(null);
  const { call } = useApi();
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    briefModalOpen: false
  })
  const [pendingData, setPendingData] = useState<PendingData[] | null>(null);
  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleCreateBrief = () => {
    toast({
      title: "Create Brief",
      description: "Opening brief creation form",
    });
  };

  const handleClick = (message: string) => {
    setOpen(true);
    setMessage(message);
  };
  
  const handleClose = () => {
    setOpen(false);
  }

  const getBriefs = useCallback(async (page = 1): Promise<void> => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const response = await call("get", `/api/summaries?page=${page}`, {
      showToast: true,
      toastTitle: "Failed to fetch summaries",
      toastDescription: "Unable to load briefs. Please try again.",
    });

    if (response) {
      setBriefs(response?.data);

      setPagination((prev) => ({
        ...prev,
        currentPage: response?.meta?.current_page || 1,
        totalPages: response?.meta?.last_page || 1,
      }));
    }
  }, [call]);

  const getBrief = useCallback(
    async (briefId: number): Promise<false | Summary> => {
      const response = await call("get", `/api/summary/${briefId}/status`, {
        showToast: true,
        toastTitle: "Failed to fetch brief",
        toastDescription: "Something went wrong while fetching the brief.",
        returnOnFailure: false, 
      });
      console.log(response, 'fetch brief api');

      return response?.data?.status === "success" || response?.data?.status === "failed" ? response?.data : false;
    },
    [call]
  );

  useEffect(() => {
    getBriefs(1);
  }, [getBriefs]);

  useEffect(() => {
    if (!briefs) return;

    const newPending = briefs
      .filter(
        (brief) => brief.status !== "success" && brief.status !== "failed"
      )
      .map((brief) => ({ id: brief.id, status: true }));

    setPendingData(newPending);
  }, [briefs, setPendingData]);

  useEffect(() => {
      // Clear existing intervals first
      intervalIDsRef.current.forEach(clearInterval);
      intervalIDsRef.current = [];
  
      if (!pendingData?.length) return;
  
      const ids = pendingData.map((item) => {
        const intervalId = setInterval(async () => {
          const data = await getBrief(item.id);
  
          if (data) {
            setPendingData(
              (prev) => prev?.filter((data) => data.id !== item.id) ?? []
            );
  
            setBriefs((prev) => {
              if (!prev) return null;
              return prev?.map((brief) => brief.id === item.id ? data : brief) || null;
            });
  
            clearInterval(intervalId);
  
            intervalIDsRef.current = intervalIDsRef.current.filter(
              (id) => id !== intervalId
            );
          }
        }, 3000);
  
        return intervalId;
      });
  
      intervalIDsRef.current = ids;
  
      return () => {
        intervalIDsRef.current.forEach(clearInterval);
        intervalIDsRef.current = [];
      };
    }, [pendingData, getBrief]);

  const handleOpenBrief = useCallback((briefId: number) => {
    setUiState(prev => ({
      ...prev,
      selectedBrief: briefId,
      briefModalOpen: true
    }));
  }, []);

  const handleCloseBriefModal = useCallback(() => {
    getBriefs(pagination.currentPage);
    setUiState(prev => ({
      ...prev,
      briefModalOpen: false
    }));
  }, [pagination.currentPage, getBriefs]);

  return (
    <DashboardLayout 
      currentPage="briefs" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Briefs</h1>
            <p className="text-text-secondary mt-1">View and manage all your briefs</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              onClick={handleCreateBrief}
              className="rounded-full shadow-subtle hover:shadow-glow transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Create Brief
            </Button>
            <Button 
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
            >
              <Filter className="mr-2 h-5 w-5" /> Filter
            </Button>
          </div>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Briefs</h2>
            
            <div className="space-y-1">
              {briefs?.map((brief, index) => (
                <React.Fragment key={brief?.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer" onClick={() => brief?.status === "success" ? handleOpenBrief(brief?.id) : null}>
                    <div className="flex items-center">
                      <Archive className="h-5 w-5 text-accent-primary mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-text-primary">{brief.title}</h3>
                          {!brief?.read_at && (
                            <span className="ml-2 h-2 w-2 bg-accent-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{brief.summaryTime}</p>
                      </div>
                    </div>
                    {/* <Button onClick={() => handleOpenBrief(brief?.id)} size="sm" variant="ghost">View</Button> */}
                    {(brief?.status !== "failed" && brief?.status !== "success")  && (
                      <span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-yellow-500 text-yellow-500">
                        Generating summary
                      </span>
                    )}
                    {brief?.status === "failed" && (
                      <span onClick={() => handleClick(brief?.error)} className="text-sm text-text-secondary border px-2 py-1 rounded-md border-red-500 text-red-500">
                        Failed to generate the summary
                      </span>
                    )}
                  </div>
                  {index + 1 !== briefs.length && <Separator className="bg-border-subtle my-1" />}
                </React.Fragment>
              ))}
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
      <BriefModal
        open={uiState.briefModalOpen}
        briefId={uiState.selectedBrief}
        onClose={handleCloseBriefModal}
      />
      <ViewErrorMessage open={open} onClose={handleClose} message={message} />
    </DashboardLayout>
  );
};

export default BriefsList;
