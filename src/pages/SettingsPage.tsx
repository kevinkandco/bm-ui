import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Settings, User, Bell, Clock, Shield, Zap, Save, Brain, Calendar, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import IntegrationsSection from "@/components/settings/IntegrationsSection";
import FeedbackTrainingSection from "@/components/settings/FeedbackTrainingSection";
import BriefConfigurationSection from "@/components/settings/BriefConfigurationSection";
import ReferralProgramSection from "@/components/settings/ReferralProgramSection";
import InterruptRulesSection from "@/components/settings/InterruptRulesSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate, useLocation } from "react-router-dom";

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get activeSection from navigation state or default to "profile"
  const [activeSection, setActiveSection] = React.useState(
    location.state?.activeSection || "profile"
  );

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
      id: "interrupt-rules",
      icon: Shield,
      name: "Interrupt Rules",
      active: activeSection === "interrupt-rules"
    },
    {
      id: "privacy",
      icon: Shield,
      name: "Privacy & Security",
      active: activeSection === "privacy"
    }
  ];

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
      case "interrupt-rules":
        return <InterruptRulesSection />;
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
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-text-primary mb-2">{settingCategories.find(cat => cat.id === activeSection)?.name}</h2>
            <p className="text-text-secondary">This section is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <AppLayout currentPage="settings">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-text-primary flex items-center">
            <Settings className="mr-2 md:mr-3 h-5 w-5 md:h-6 md:w-6" />
            Settings
          </h1>
          <p className="text-sm md:text-base text-text-secondary mt-1">Manage your account and preferences</p>
        </div>
        
        <div className="glass-card rounded-xl md:rounded-3xl overflow-hidden">
          <div className="flex flex-col md:grid md:grid-cols-4">
            {/* Mobile Category Selector */}
            <div className="md:hidden p-4 border-b border-border-subtle">
              <h2 className="text-base font-medium text-text-primary mb-3">Categories</h2>
              <div className="grid grid-cols-2 gap-2">
                {settingCategories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => setActiveSection(category.id)}
                    className={`flex items-center p-2 rounded-lg transition-all text-sm ${
                      category.active 
                        ? 'bg-white/10 text-white' 
                        : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
                    }`}
                  >
                    <category.icon className="h-4 w-4 mr-2" />
                    <span className="truncate">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block p-4 md:p-6 border-r border-border-subtle">
              <h2 className="text-lg font-medium text-text-primary mb-4">Categories</h2>
              <div className="space-y-1">
                {settingCategories.map((category) => (
                  <button 
                    key={category.id}
                    onClick={() => setActiveSection(category.id)}
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
            
            <div className="md:col-span-3 p-4 md:p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
