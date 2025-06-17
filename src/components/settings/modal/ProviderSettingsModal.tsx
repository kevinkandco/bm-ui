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
import { SettingsTabProps, ProviderData } from "./types";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Provider } from "@radix-ui/react-toast";

interface ProviderSettingsModalProps {
  open: boolean;
  onClose: () => void;
  provider: { id: number; name: string };
  firstTimeProviderConnected?: boolean;
  setFirstTimeProviderConnected?: React.Dispatch<React.SetStateAction<boolean>>;
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
  Component: React.ComponentType<SettingsTabProps>;
  active: boolean;
}

const ProviderSettingsModal = ({
  open,
  onClose,
  provider,
  firstTimeProviderConnected = false,
  setFirstTimeProviderConnected,
  initialTab = "priorityPeople",
}: ProviderSettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [providerData, setProviderData] = useState<ProviderData>();
  const [loadingProviderData, setLoadingProviderData] = useState(false);
  const [SyncLoading, setSyncLoading] = useState(false);
  const { call } = useApi();

  
  const priorityPeopleActive = useMemo(() => ['slack', 'google', 'outlook', 'calendar'], []);
  const priorityChannelsActive = useMemo(() => ['slack'], []);
  const priorityTopicsActive = useMemo(() => ['slack', 'google', 'outlook', 'calendar'], []);
  const ignoreActive = useMemo(() => ['slack', 'google', 'outlook', 'calendar'], []);

  const tabs: TabConfig[] = useMemo(() => [
    {
      id: "priorityPeople",
      label: "Priority People",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityPeople,
      active: priorityPeopleActive.includes(provider?.name?.toLowerCase() || ''),
    },
    {
      id: "priorityChannels",
      label: "Priority Channels",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityChannelsSetting,
      active: priorityChannelsActive.includes(provider?.name?.toLowerCase() || ''),
    },
    {
      id: "priorityTopics",
      label: "Priority Topics",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: PriorityTopics,
      active: priorityTopicsActive.includes(provider?.name?.toLowerCase() || ''),
    },
    {
      id: "ignore",
      label: "Ignore Configuration",
      icon: <ChevronRight className="h-4 w-4" />,
      Component: IgnoreSetting,
      active: ignoreActive.includes(provider?.name?.toLowerCase() || ''),
    },
  ], [priorityChannelsActive, priorityPeopleActive, priorityTopicsActive, ignoreActive, provider?.name]);

  const getProviderData = useCallback(async (): Promise<void> => {
    setLoadingProviderData(true);
    const response = await call("get", "/api/settings/system-integrations/" + provider.id);

    if (response) {
      setProviderData(response);
    }
    setLoadingProviderData(false);
  }, [call, provider.id]);

  useEffect(() => {
    getProviderData();
  }, [getProviderData]);

  const syncData = useCallback(async (): Promise<void> => {
    setSyncLoading(true);
    const response = await call("get", `/api/${Provider[provider?.name]}/fetch?id=${provider?.id}`);

    if (response) {
      getProviderData();
    }
    setSyncLoading(false);
  }, [call, getProviderData, provider]);

    useEffect(() => {
    if (firstTimeProviderConnected) {
      setActiveTab("priorityPeople");
      syncData();
    }
  }, [firstTimeProviderConnected, syncData]);

  const handleNext = useCallback(() => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const nextIndex = tabs[currentIndex + 1];
    if (nextIndex) setActiveTab(nextIndex.id);
  }, [activeTab, tabs]);

  const handleSave = useCallback(async (): Promise<void> => {
    setIsSaving(true);
    const response = await call("post", `/api/settings/system-integrations/${provider.id}/update`, {
      body: providerData,
    });

    if (response) {
      onClose();
    }
    if (setFirstTimeProviderConnected) setFirstTimeProviderConnected(false);
    setIsSaving(false);
  }, [call, providerData, onClose, setFirstTimeProviderConnected, provider.id]);

  const handleClose = () => {
    onClose();
    if (setFirstTimeProviderConnected) setFirstTimeProviderConnected(false);
    getProviderData();
  }

  const ActiveComponent = tabs.find((tab) => tab.id === activeTab)?.Component;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60rem] max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border border-gray-700/40">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-medium text-white">
              {capitalizeFirstLetter(provider?.name)} Settings
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-56 pr-4 border-r border-white/10 flex flex-col">
            <ul className="space-y-1 flex-1">
              {tabs.map((tab) => {
                if (!tab.active) return null

                return (
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
              )})}
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-6 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-4">
              {ActiveComponent && (
                <ActiveComponent
                  providerData={providerData}
                  setProviderData={setProviderData}
                  syncData={syncData}
                  SyncLoading={SyncLoading}
                  loadingProviderData={loadingProviderData}
                  provider={provider}
                />
              )}
            </div>

            <div className="flex justify-end items-center pt-4 mt-auto border-t border-white/10">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                {firstTimeProviderConnected &&
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

export default ProviderSettingsModal;
