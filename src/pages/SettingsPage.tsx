import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, Clock, Shield, Zap, AudioLines, LogOut } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Profile from "@/components/settings/Profile";
// import Notifications from "@/components/settings/Notifications";
// import DeliverySchedule from "@/components/settings/DeliverySchedule";
// import PrivacySecurity from "@/components/settings/PrivacySecurity";
import Integrations from "@/components/settings/Integrations";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Voices from "@/components/settings/modal/Voices";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";

const SettingsPage = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("profile");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { call } = useApi();
  const { logout, gotoLogin } = useAuthStore();

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const settingCategories = [
    {
      id: "profile",
      icon: User,
      name: "Profile",
      component: <Profile />
    },
    {
      id: "notifications",
      icon: Bell,
      name: "Notifications",
      // component: <Notifications />
    },
    {
      id: "delivery",
      icon: Clock,
      name: "Delivery Schedule",
      // component: <DeliverySchedule />
    },
    {
      id: "privacy",
      icon: Shield,
      name: "Privacy & Security",
      // component: <PrivacySecurity />
    },
    {
      id: "voices",
      icon: AudioLines,
      name: "Voices",
      component: <Voices />
    },
    {
      id: "integrations",
      icon: Zap,
      name: "Integrations",
      component: <Integrations />
    },
    {
      id: "logout",
      icon: LogOut,
      name: "Logout",
    }
  ];

  const handleCategoryClick = useCallback(
    async (categoryId: string) => {
      if (categoryId === "logout") {
        const response = await call("get", "/api/logout", {
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
          // }
          return;
        }
      }
      setActiveCategory(categoryId);
    },
    [call, toast, gotoLogin, logout]
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    const selected = searchParams.get("selected");

    if (tab) {
      const url = new URL(window.location.href);
      url.searchParams.delete("tab");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
      handleCategoryClick(tab);
    }
  }, [searchParams, handleCategoryClick]);

  const activeComponent = settingCategories.find(
    category => category.id === activeCategory
  )?.component;

  return (
    <DashboardLayout 
      currentPage="settings" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary flex items-center">
              <Settings className="mr-3 h-6 w-6" />
              Settings
            </h1>
            <p className="text-text-secondary mt-1">Manage your account and preferences</p>
          </div>

          <Button
            variant="outline"
            size="default"
            className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
            onClick={() => navigate("/dashboard")}
          >
            <span className="text-xs sm:text-sm">Go to Dashboard</span>
          </Button>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {/* Settings Categories Sidebar */}
            <div className="p-6 border-r border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary mb-4">Categories</h2>
              <div className="space-y-1">
                {settingCategories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all ${
                      activeCategory === category.id
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
            
            {/* Settings Content */}
            <div className="md:col-span-3 p-6">
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;