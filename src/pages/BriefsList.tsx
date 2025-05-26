
import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Archive, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Http from "@/Http";
import { Summary } from "@/components/dashboard/types";
import Pagination from "@/components/dashboard/Pagination";
import BriefModal from "@/components/dashboard/BriefModal";

const BaseURL = import.meta.env.VITE_API_HOST;

const BriefsList = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [briefs, setBriefs] = useState<Summary[] | null>(null);
  const navigate = useNavigate();
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    briefModalOpen: false
  })

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

  const getBriefs = useCallback(async (page = 1): Promise<void> => {
      try {
  
        window.scrollTo({ top: 0, behavior: "smooth" });
  
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        Http.setBearerToken(token);
        const response = await Http.callApi("get", `${BaseURL}/api/summaries?page=${page}`);
        if (response) {
          setBriefs(response?.data?.data);
          
          setPagination(prev => ({
            ...prev,
            currentPage: response?.data?.meta?.current_page || 1,
            totalPages: response?.data?.meta?.last_page || 1,
          }));
        } else {
          console.error("Failed to fetch summaries data"); 
          toast({
            title: "Error",
            description: "Failed to fetch summaries data.",
          });
        }
      } catch (error) {
        console.error("Error fetching summaries data:", error);
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Failed to fetch summaries data.";
  
        toast({
          title: "Focus Mode Exit failed",
          description: errorMessage,
        });
      }
  }, [navigate, toast]);

  useEffect(() => {
    getBriefs(1);
  }, [getBriefs]);

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
                <div key={brief?.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
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
                    <Button onClick={() => handleOpenBrief(brief?.id)} size="sm" variant="ghost">View</Button>
                  </div>
                  {index + 1 !== briefs.length && <Separator className="bg-border-subtle my-1" />}
                </div>
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
    </DashboardLayout>
  );
};

export default BriefsList;
