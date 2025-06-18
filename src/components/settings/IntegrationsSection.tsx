
import React, { useEffect, useState } from "react";
import { Plus, Settings as SettingsIcon, AlertCircle, X, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConnectedAccountsList from "./ConnectedAccountsList";
import TagManager from "./TagManager";
import InputIntegrationsSection from "./InputIntegrationsSection";
import OutputIntegrationsSection from "./OutputIntegrationsSection";
import { useIntegrationsState } from "./useIntegrationsState";
import FancyLoader from "./modal/FancyLoader";
import { useSearchParams } from "react-router-dom";
import ProviderSettingsModal from "./modal/ProviderSettingsModal";

const IntegrationsSection = () => {
  const { toast } = useToast();
  const {
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
    loading
  } = useIntegrationsState();
  const [searchParams] = useSearchParams();
  const [showTagManager, setShowTagManager] = useState(false);
  const [providerModal, setProviderModal] = useState({
    open: false,
    id: 0,
    name: "",
  });
  const [firstTimeSlackConnected, setFirstTimeSlackConnected] = useState(false);

  useEffect(() => {
      const selected = searchParams.get("selected");
      const id = searchParams.get("id");
  
      const url = new URL(window.location.href);
      url.searchParams.delete("selected");
      if (selected === "slack") {
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
        setFirstTimeSlackConnected(true);
      }
    }, [searchParams]);

  const handleAddAccount = (provider: string, type: 'input' | 'output') => {
    // Simulate OAuth flow
    addAccount(provider, type);
    toast({
      title: "Integration Connected",
      description: `Your ${provider} integration has been connected successfully.`,
    });
  };

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

      {/* Input Integrations */}
      <InputIntegrationsSection onConnect={handleAddAccount} />

      {/* Output Integrations */}
      <OutputIntegrationsSection onConnect={handleAddAccount} />
      {providerModal.open && <ProviderSettingsModal
        open={providerModal.open}
        onClose={() => setProviderModal({open: false, id: 0, name: ""})}
        provider={{ id: providerModal.id, name: providerModal.name }}
        firstTimeSlackConnected={firstTimeSlackConnected}
        setFirstTimeSlackConnected={setFirstTimeSlackConnected}
      />}
    </div>
  );
};

export default IntegrationsSection;
