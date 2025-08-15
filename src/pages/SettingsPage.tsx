import React, { useCallback, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, Clock, Shield, Zap, AudioLines, LogOut, Save, Brain,Calendar, Gift, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import Voices from "@/components/settings/modal/Voices";
import DownloadApp from "@/components/settings/modal/DownloadApp";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";
import IntegrationsSection from "@/components/settings/IntegrationsSection";
import FeedbackTrainingSection from "@/components/settings/FeedbackTrainingSection";
import BriefConfigurationSection from "@/components/settings/BriefConfigurationSection";
import ReferralProgramSection from "@/components/settings/ReferralProgramSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProfileSettings from "@/components/settings/ProfileSettings";

const SettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchParams] = useSearchParams();
  const { call } = useApi();
  const { logout, gotoLogin } = useAuthStore();
  
  // Get activeSection from navigation state or default to "profile"
  const [activeSection, setActiveSection] = React.useState(
    location.state?.activeSection || "profile"
  );

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const settingCategories = useMemo(() => [
    {
      id: "profile",
      icon: User,
      name: "Profile",
      active: activeSection === "profile"
    },
    {
      id: "integrations",
      icon: Zap,
      name: "Integrations",
      active: activeSection === "integrations"
    },
    {
      id: "brief-config",
      icon: Calendar,
      name: "Brief Configuration",
      active: activeSection === "brief-config"
    },
    {
      id: "download-app",
      icon: Download,
      name: "Download App",
      active: activeSection === "download-app"
    },
    {
      id: "feedback",
      icon: Brain,
      name: "Feedback & Training",
      active: activeSection === "feedback"
    },
    {
      id: "referral",
      icon: Gift,
      name: "Referral Program",
      active: activeSection === "referral"
    },
    {
      id: "notifications",
      icon: Bell,
      name: "Notifications",
      active: activeSection === "notifications"
    },
    {
      id: "delivery",
      icon: Clock,
      name: "Delivery Schedule",
      active: activeSection === "delivery"
    },
    {
      id: "voices",
      icon: AudioLines,
      name: "Voices",
      active: activeSection === "voices"
    },
    {
      id: "privacy",
      icon: Shield,
      name: "Privacy & Security",
      active: activeSection === "privacy"
    },
    {
      id: "logout",
      icon: LogOut,
      name: "Logout",
    }
  ], [activeSection]);

    const handleClick = useCallback(async (id: string) => {
    if (activeSection === id) return;

    if (id === 'logout') {
       const response = await call("get", "/logout", {
          toastTitle: "Error",
          toastDescription: "Failed to log out. Please try again.",
          toastVariant: "destructive",
        });
        if (response) {
          toast({
            title: "Logged out",
            description: "You have been successfully logged out.",
          });
          logout();
          gotoLogin();
           if (window?.electronAPI) {      
              window?.electronAPI?.deleteToken();
            }
          return;
        }
    }

    setActiveSection(id);
    
  }, [activeSection, call, gotoLogin, logout, toast]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      // Clean up URL without causing navigation
      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("tab");
      window.history.replaceState({}, document.title, cleanUrl.toString());

      // Validate tab before setting
      const validTabs = settingCategories.map(cat => cat.id);
      if (validTabs.includes(tab)) {
        setActiveSection(tab);
      } else {
        console.warn(`Invalid tab parameter: ${tab}`);
      }
    }
  }, [searchParams, user, settingCategories]);


  const renderContent = () => {
    switch (activeSection) {
      case "integrations":
        return <IntegrationsSection />;
      case "brief-config":
        return <BriefConfigurationSection />;
      case "feedback":
        return <FeedbackTrainingSection />;
      case "referral":
        return <ReferralProgramSection />;
      case "profile":
        return <ProfileSettings />;
      case "voices":
        return <Voices />;

      case "download-app":
        return <DownloadApp />;
        
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-2">{settingCategories?.find(cat => cat?.id === activeSection)?.name}</h2>
            <p className="text-text-secondary">This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout 
      currentPage="settings" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
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
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary flex items-center">
            <Settings className="mr-3 h-6 w-6" />
            Settings
          </h1>
          <p className="text-text-secondary mt-1">Manage your account and preferences</p>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4">
            <div className="p-6 border-r border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary mb-4">Categories</h2>
              <div className="space-y-1">
                {settingCategories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => handleClick(category.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${
                      category.active
                        ? 'bg-white/10 text-white' 
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    <category.icon className="h-5 w-5 mr-3" />
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-3 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;