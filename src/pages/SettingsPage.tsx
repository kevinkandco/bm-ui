import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, User, Bell, Clock, Shield, Zap, AudioLines, LogOut, Save, Brain,Calendar, Gift } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Voices from "@/components/settings/modal/Voices";
import { useApi } from "@/hooks/useApi";
import useAuthStore from "@/store/useAuthStore";
import IntegrationsSection from "@/components/settings/IntegrationsSection";
import FeedbackTrainingSection from "@/components/settings/FeedbackTrainingSection";
import Integrations from "@/components/settings/Integrations";
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

const BaseURL = import.meta.env.VITE_API_HOST;

const SettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [activeCategory, setActiveCategory] = React.useState("profile");
  const [searchParams] = useSearchParams();
  const { call } = useApi();
  const { logout, gotoLogin } = useAuthStore();
  const [settings, setSettings] = React.useState({
    name: "",
    job_title: "",
    department: "",
    profileImage: "",
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  
  // Get activeSection from navigation state or default to "profile"
  const [activeSection, setActiveSection] = React.useState(
    location.state?.activeSection || "profile"
  );

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSaveSettings = async () => {

    const formData = new FormData();
    formData.append("name", settings.name);
    formData.append("job_title", settings.job_title);
    formData.append("department", settings.department);
    if (imageFile) {
      formData.append("profile_path", imageFile); // must match backend field
    }


    const response = await call("post", "/api/settings/profile-update", {
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      showToast: true,
      toastTitle: "Settings Save Failed",
      toastDescription: "Failed to save settings",
    });
    if (response) toast({
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
      id: "brief-config",
      icon: Calendar,
      name: "Brief Configuration",
      active: activeSection === "brief-config"
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

    if (user) {
      setSettings({
        name: user.name,
        job_title: user.job_title,
        department: user.department,
        profileImage: user?.profile_path ? user.profile_path : null,
      })
    }

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
  }, [searchParams, handleCategoryClick, user]);

  const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e)
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // Optional: Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings((prev) => ({
          ...prev,
          profileImage: reader.result as string, // just for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSettings(prev => ({
      ...prev,
      profileImage: "", // or null
    }));
    setImageFile(null);
  };


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
        return (
          <>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Profile Settings</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium text-text-primary mb-4">Personal Information</h3>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <div className="flex items-center gap-4">
                    <img
                      src={settings?.profileImage || '/images/default.png'} // fallback image
                      alt="Profile"
                      className="object-cover rounded-full shadow w-24 h-24 sm:w-36 sm:h-36 border-2 border-accent-primary cursor-pointer"
                    />
                    <div className="flex flex-col justify-center gap-5">
                        <h1 className="text-xl text-center md:text-start">Profile Picture</h1>
                        <div
                            className="flex flex-col items-center justify-center gap-3 md:flex-row md:justify-start">
                            <div
                                className="py-2 px-3 flex items-center gap-2 bg-[#377E7F] text-white rounded-lg cursor-pointer relative">
                                {/* <img src="/images/upload.svg" className="w-6 h-6"> */}
                                <span className="cursor-pointer text-sm">Upload Photo</span>
                                <input 
                                    accept="image/png, image/gif, image/jpeg" 
                                    onChange={handleImageUpload}
                                    type="file" 
                                    className="absolute right-0 z-0 w-full opacity-0 cursor-pointer" />
                            </div>
  
                            {settings?.profileImage && (
                              <div>
                                  <button onClick={handleRemoveImage} type="button" className="w-full sm:w-auto sm:text-sm py-2 px-3 flex items-center gap-2 bg-[#377E7F] text-white rounded-lg cursor-pointer relative">
                                      Remove
                                  </button>
                              </div>
                            )}
                        </div>
                        <p className="text-sm">We support PNGs,JPEGs, and GIFs under 2Mb</p>
                    </div>
                  {/* <label className="block text-sm font-medium text-text-secondary mb-1">Profile Picture</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-sm text-text-primary"
                    /> */}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={settings?.name}
                    name="name"
                    onChange={handleUpdate}
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={user?.email}
                    disabled
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Job Title</label>
                  <input 
                    type="text" 
                    name="job_title"
                    value={settings?.job_title}
                    onChange={handleUpdate}
                    className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Department</label>
                  <input 
                    type="text" 
                    name="department"
                    value={settings?.department}
                    onChange={handleUpdate}
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