
import React, { useState } from "react";
import { Mail, Slack, Calendar, ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConnectedAccount, Tag } from "./types";
import TagSelector from "./TagSelector";

interface ConnectedAccountsListProps {
  accounts: ConnectedAccount[];
  tags: Tag[];
  onUpdateTag: (accountId: string, tagId: string) => void;
  onToggleCombined: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
  onCreateTag: (name: string, color: string, emoji: string) => void;
}

const ConnectedAccountsList = ({
  accounts,
  tags,
  onUpdateTag,
  onToggleCombined,
  onDisconnect,
  onCreateTag
}: ConnectedAccountsListProps) => {
  const [editingTag, setEditingTag] = useState<string | null>(null);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "gmail":
      case "outlook":
        return <Mail className="h-4 w-4" />;
      case "slack":
        return <Slack className="h-4 w-4" />;
      case "calendar":
        return <Calendar className="h-4 w-4" />;
      default:
        return <div className="w-4 h-4 bg-white/20 rounded" />;
    }
  };

  const getTag = (tagId: string) => tags.find(tag => tag.id === tagId);

  return (
    <div className="space-y-3">
      {accounts.map((account) => {
        const tag = getTag(account.tagId);
        
        return (
          <div
            key={account.id}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center space-x-4 flex-1">
              {/* Provider Icon */}
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                {getProviderIcon(account.provider)}
              </div>

              {/* Account Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-text-primary capitalize">
                    {account.provider}
                  </h4>
                  <span className="text-sm text-text-secondary truncate">
                    {account.email || account.name}
                  </span>
                </div>
                
                {/* Tag Display/Selector */}
                <div className="mt-1">
                  {editingTag === account.id ? (
                    <TagSelector
                      tags={tags}
                      selectedTagId={account.tagId}
                      onSelect={(tagId) => {
                        onUpdateTag(account.id, tagId);
                        setEditingTag(null);
                      }}
                      onCreateTag={onCreateTag}
                      onCancel={() => setEditingTag(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setEditingTag(account.id)}
                      className="flex items-center space-x-1 hover:bg-white/5 rounded px-2 py-1 transition-colors"
                    >
                      {tag && (
                        <>
                          <span className="text-lg">{tag.emoji}</span>
                          <Badge 
                            variant="secondary" 
                            style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        </>
                      )}
                      <ChevronDown className="h-3 w-3 text-text-secondary" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Include in Combined Brief Switch */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text-secondary whitespace-nowrap">
                  Include in Combined
                </span>
                <Switch
                  checked={account.includeInCombined}
                  onCheckedChange={() => onToggleCombined(account.id)}
                />
              </div>

              {/* Disconnect Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4 text-text-secondary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onDisconnect(account.id)}
                    className="text-red-400 focus:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Disconnect Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}

      {accounts.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <p>No accounts connected yet.</p>
          <p className="text-sm mt-1">Click "Add Account" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ConnectedAccountsList;
