
import React, { useCallback, useEffect, useState } from "react";
import { Plus, Settings as SettingsIcon, AlertCircle, X, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConnectedAccountsList from "./ConnectedAccountsList";
import TagManager from "./TagManager";
import InputIntegrationsSection from "./InputIntegrationsSection";
import OutputIntegrationsSection from "./OutputIntegrationsSection";
import AISettingsModal from "./AISettingsModal";
import { useIntegrationsState } from "./useIntegrationsState";
import FancyLoader from "./modal/FancyLoader";
import { useSearchParams } from "react-router-dom";
import ProviderSettingsModal from "./modal/ProviderSettingsModal";
import ConnectModal from "./modal/ConnectModal";
import { useApi } from "@/hooks/useApi";

const AllowedProvidersForModal = ["slack", "google"];

const IntegrationsSection = () => {
  const { toast } = useToast();
  const {
    getProvider,
    connectedAccounts,
    tags,
    showFirstTimeHelper,
    addAccount,
    updateAccountTag,
    updateAccountName,
    toggleAccountInCombined,
    disconnectAccount,
    createTag,
    updateTag,
    deleteTag,
    mergeTag,
    dismissFirstTimeHelper,
    loading,
    connectModal,
    setConnectModal
  } = useIntegrationsState();
  const { call } = useApi();

  const [aiSettingsModal, setAiSettingsModal] = useState<{
    isOpen: boolean;
    accountName: string;
    provider: string;
    accountType: 'email' | 'slack';
    currentSettings?: any;
    onSave: (settings: any) => void;
  }>({
    isOpen: false,
    accountName: "",
    provider: "",
    accountType: 'email',
    currentSettings: {},
    onSave: () => {}
  });

  const [searchParams] = useSearchParams();
  const [showTagManager, setShowTagManager] = useState(false);
  const [providerModal, setProviderModal] = useState({
    open: false,
    id: 0,
    name: "",
  });
  const [firstTimeProviderConnected, setFirstTimeProviderConnected] = useState(false);

  useEffect(() => {
      const selected = searchParams.get("selected");
      const id = searchParams.get("integration_id");
  
      const url = new URL(window.location.href);
      url.searchParams.delete("selected");
      url.searchParams.delete("integration_id");
      if (selected && id && AllowedProvidersForModal.includes(selected)) {
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );  
        setProviderModal({
          open: true,
          id: Number(id),
          name: selected,
        });
        setFirstTimeProviderConnected(true);
      }
    }, [searchParams]);

  const handleAddAccount = (provider: string, type: 'input' | 'output') => {
    addAccount(provider, type);
  };

  const handleOpenAISettings = (accountName: string, provider: string, accountType: 'email' | 'slack', currentSettings: any = {}) => {
    setAiSettingsModal({
      isOpen: true,
      accountName,
      provider,
      accountType,
      currentSettings,
      onSave: (settings) => {
        // Handle saving settings here
        console.log('Saving AI settings:', settings);
        toast({
          title: "Settings Updated",
          description: `AI ${accountType === 'email' ? 'email' : 'message'} management settings for ${accountName} have been updated.`,
        });
      }
    });
  };

  const handleConnectToGoogle = useCallback(async () => {
    const response = await call("post", "/settings/system-integrations/google-calendar",
      {
        showToast: true,
        toastTitle: "Failed to fetch user data",
        toastDescription: "Something went wrong. Failed to fetch user data.",
      }
    );

    if (!response) return;
    
    
    setConnectModal({
      open: false,
      providerName: ""
    });
    
    await getProvider();

    toast({
      title: "Success",
      description: "Successfully added calendar account.",
    });
  }, [getProvider, call, toast, setConnectModal]);


  const hasMultipleTags = tags.length > 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Integrations</h2>
      </div>

      <p className="text-text-secondary">
        Connect your accounts to automatically pull in data (inputs) or push out tasks and updates (outputs). Organize them with tags and configure what gets processed.
      </p>

      {/* First-Time Helper Banner */}
      {showFirstTimeHelper && hasMultipleTags && (
        <div className="relative bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <button
            onClick={dismissFirstTimeHelper}
            className="absolute top-2 right-2 text-text-secondary hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-text-primary">Multiple accounts detected</h3>
              <p className="text-sm text-text-secondary mt-1">
                Great! You can organize these accounts with tags and configure what data gets processed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connected Accounts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-text-primary">Connected Accounts</h3>
          {tags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTagManager(!showTagManager)}
              className="text-text-secondary hover:text-text-primary"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Manage Tags
            </Button>
          )}
        </div>

        {loading ?  <FancyLoader /> : <ConnectedAccountsList
          accounts={connectedAccounts}
          tags={tags}
          onUpdateTag={updateAccountTag}
          onUpdateAccountName={updateAccountName}
          onToggleCombined={toggleAccountInCombined}
          onDisconnect={disconnectAccount}
          onCreateTag={createTag}
          setProviderModal={setProviderModal}
        />}
      </div>

      {/* Tag Manager */}
      {showTagManager && (
        <TagManager
          tags={tags}
          onUpdateTag={updateTag}
          onDeleteTag={deleteTag}
          onMergeTag={mergeTag}
          onClose={() => setShowTagManager(false)}
        />
      )}

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={aiSettingsModal.isOpen}
        onClose={() => setAiSettingsModal(prev => ({ ...prev, isOpen: false }))}
        accountName={aiSettingsModal.accountName}
        provider={aiSettingsModal.provider}
        accountType={aiSettingsModal.accountType}
        currentSettings={aiSettingsModal.currentSettings}
        onSave={aiSettingsModal.onSave}
      />

      {/* Input Integrations */}
      <InputIntegrationsSection onConnect={handleAddAccount} />

      {/* Output Integrations */}
      <OutputIntegrationsSection onConnect={handleAddAccount} />
      {providerModal.open && <ProviderSettingsModal
        open={providerModal.open}
        onClose={() => setProviderModal({open: false, id: 0, name: ""})}
        provider={{ id: providerModal.id, name: providerModal.name }}
        firstTimeProviderConnected={firstTimeProviderConnected}
        setFirstTimeProviderConnected={setFirstTimeProviderConnected}
      />}
      
      <ConnectModal
        open={connectModal?.open}
        onClose={() => setConnectModal({open: false, providerName: ""})}
        onConnect={handleConnectToGoogle}
        providerName={connectModal?.providerName}
      />
    </div>
  );
};

export default IntegrationsSection;
