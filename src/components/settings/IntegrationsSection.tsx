
import React, { useState } from "react";
import { Plus, Settings as SettingsIcon, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ConnectedAccountsList from "./ConnectedAccountsList";
import TagManager from "./TagManager";
import SplitBriefControls from "./SplitBriefControls";
import { useIntegrationsState } from "./useIntegrationsState";

const IntegrationsSection = () => {
  const { toast } = useToast();
  const {
    connectedAccounts,
    tags,
    showFirstTimeHelper,
    addAccount,
    updateAccountTag,
    toggleAccountInCombined,
    disconnectAccount,
    createTag,
    updateTag,
    deleteTag,
    mergeTag,
    updateSplitBriefSettings,
    dismissFirstTimeHelper
  } = useIntegrationsState();

  const [showTagManager, setShowTagManager] = useState(false);

  const handleAddAccount = (provider: string) => {
    // Simulate OAuth flow
    addAccount(provider);
    toast({
      title: "Account Connected",
      description: `Your ${provider} account has been connected successfully.`,
    });
  };

  const hasMultipleTags = tags.length > 1;
  const hasActiveSplitBriefs = tags.some(tag => tag.splitBriefEnabled);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Integrations</h2>
        <Button 
          onClick={() => handleAddAccount("gmail")}
          className="shadow-subtle hover:shadow-glow transition-all"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* First-Time Helper Banner */}
      {showFirstTimeHelper && hasMultipleTags && !hasActiveSplitBriefs && (
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
                Looks like you've got multiple inboxes. Want separate briefs for each? Flip the switch next to any tag.
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

        <ConnectedAccountsList
          accounts={connectedAccounts}
          tags={tags}
          onUpdateTag={updateAccountTag}
          onToggleCombined={toggleAccountInCombined}
          onDisconnect={disconnectAccount}
          onCreateTag={createTag}
        />
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

      {/* Split Brief Controls */}
      {hasMultipleTags && (
        <SplitBriefControls
          tags={tags}
          onUpdateSettings={updateSplitBriefSettings}
        />
      )}

      {/* Available Integrations */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary">Available Integrations</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: "Gmail", provider: "gmail", available: true },
            { name: "Outlook", provider: "outlook", available: true },
            { name: "Slack", provider: "slack", available: true },
            { name: "Google Calendar", provider: "calendar", available: true },
            { name: "Asana", provider: "asana", available: false },
            { name: "Notion", provider: "notion", available: false }
          ].map((integration) => (
            <Button
              key={integration.provider}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                !integration.available ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => integration.available && handleAddAccount(integration.provider)}
              disabled={!integration.available}
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{integration.name[0]}</span>
              </div>
              <span className="text-sm">{integration.name}</span>
              {!integration.available && (
                <span className="text-xs text-text-secondary">Coming Soon</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationsSection;
