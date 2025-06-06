import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, Clock, Shield, Zap, AudioLines, LogOut, Save, Brain } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Voices from "@/components/settings/modal/Voices";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";
import IntegrationsSection from "@/components/settings/IntegrationsSection";
import FeedbackTrainingSection from "@/components/settings/FeedbackTrainingSection";
import Integrations from "@/components/settings/Integrations";

const SettingsPage = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("profile");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { call } = useApi();
  const { logout, gotoLogin } = useAuthStore();
  const [activeSection, setActiveSection] = React.useState("profile");
  console.log(activeSection, "activeSection");

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

  const settingCategories = [
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
      id: "feedback",
      icon: Brain,
      name: "Feedback & Training",
      active: activeSection === "feedback"
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

  

  const renderContent = () => {
    switch (activeSection) {
      case "integrations":
        return <Integrations />;
      case "feedback":
        return <FeedbackTrainingSection />;
      case "profile":
        return (
          <>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Profile Settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-text-primary mb-4">Personal Information</h3>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Alex Johnson"
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="alex.johnson@example.com"
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Job Title</label>
                  <input 
                    type="text" 
                    defaultValue="Senior Product Manager"
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Department</label>
                  <input 
                    type="text" 
                    defaultValue="Product Development"
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="bg-border-subtle my-8" />
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-text-primary mb-4">Brief Preferences</h3>
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">Daily Briefs</h4>
                    <p className="text-sm text-text-secondary">Receive a summary of your day every morning</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-text-primary">Weekly Summaries</h4>
                    <p className="text-sm text-text-secondary">Get a comprehensive summary at the end of each week</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-primary"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                className="shadow-subtle hover:shadow-glow transition-all"
              >
                <Save className="mr-2 h-5 w-5" /> Save Changes
              </Button>
            </div>
          </>
        );
      case "voices":
        return <Voices />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-2">{settingCategories.find(cat => cat.id === activeSection)?.name}</h2>
            <p className="text-text-secondary">This section is coming soon.</p>
          </div>
        );
    }
  };

  const handleClick = useCallback(async (id: string) => {
    if (activeSection === id) return;

    if (id === 'logout') {
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

    setActiveSection(id)
  }, [activeSection, call, gotoLogin, logout, toast]);


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
            
            {/* Settings Content */}
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