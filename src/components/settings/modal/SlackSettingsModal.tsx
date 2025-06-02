import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronRight } from "lucide-react";
import PriorityPeople from "./PriorityPeople";
import PriorityChannelsSetting from "./PriorityChannelsSetting";
import IgnoreSetting from "./IgnoreSetting";
import PriorityTopics from "./PriorityTopics";
import { useApi } from "@/hooks/useApi";
import { SlackData } from "./types";

interface SlackSettingsModalProps {
  open: boolean;
  onClose: () => void;
  firstTimeSlackConnected: boolean;
  initialTab?: SettingsTab;
}

type SettingsTab =
  | "priorityPeople"
  | "priorityChannels"
  | "priorityTopics"
  | "ignore";

interface TabConfig {
  id: SettingsTab;
  label: string;
  icon?: React.ReactNode;
  Component: React.ComponentType<{
    slackData?: SlackData;
    setSlackData: React.Dispatch<React.SetStateAction<SlackData | undefined>>;
    syncData: () => void;
    SyncLoading: boolean;
  }>;
}

const SlackSettingsModal = ({
  open,
  onClose,
  firstTimeSlackConnected,
  initialTab = "priorityPeople",
}: SlackSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [slackData, setSlackData] = useState<SlackData>();
  const [SyncLoading, setSyncLoading] = useState(false);
  const { call } = useApi();
  const tabs: TabConfig[] = useMemo(() => [
    {
      id: "priorityPeople",
      label: "Priority People",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityPeople,
    },
    {
      id: "priorityChannels",
      label: "Priority Channels",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityChannelsSetting,
    },
    {
      id: "priorityTopics",
      label: "Priority Topics",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityTopics,
    },
    {
      id: "ignore",
      label: "Ignore Configuration",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: IgnoreSetting,
    },
  ], []);

  const getSlackData = useCallback(async (): Promise<void> => {
    const response = await call("get", "/api/settings/slack-data");

    if (response) {
      setSlackData(response);
    }
  }, [call]);

  useEffect(() => {
    getSlackData();
  }, [getSlackData]);

  const syncData = useCallback(async (): Promise<void> => {
    setSyncLoading(true);
    const response = await call("get", "/api/slack/fetch");

    if (response) {
      getSlackData();
    }
    setSyncLoading(false);
  }, [call, getSlackData]);

    useEffect(() => {
    if (firstTimeSlackConnected) {
      setActiveTab("priorityPeople");
      syncData();
    }
  }, [firstTimeSlackConnected, syncData]);

  const handleNext = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = tabs[currentIndex + 1];
    if (nextIndex) setActiveTab(nextIndex.id);
  }, [activeTab, tabs]);

  const handleSave = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    const response = await call("post", "/api/settings/update/slack-data", {
      body: slackData,
    });

    if (response) {
      onClose();
    }
    setIsSaving(false);
  }, [call, slackData, onClose]);

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.Component;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60rem] max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium text-white">
              Slack Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-56 pr-4 border-r border-white/10 flex flex-col">
            <ul className="space-y-1 flex-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <Button
                    variant={activeTab === tab.id ? "secondary" : "ghost"}
                    className={`w-full justify-between ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span>{tab.label}</span>
                    {tab.icon}
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-6 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-4">
              {ActiveComponent && (
                <ActiveComponent
                  slackData={slackData}
                  setSlackData={setSlackData}
                  syncData={syncData}
                  SyncLoading={SyncLoading}
                />
              )}
            </div>

            <div className="flex justify-end items-center pt-4 mt-auto border-t border-white/10">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                {firstTimeSlackConnected &&
                activeTab !== tabs[tabs.length - 1].id ? (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 min-w-32"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 min-w-32"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Settings"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlackSettingsModal;
