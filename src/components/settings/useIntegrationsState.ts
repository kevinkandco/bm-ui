import { useState, useCallback } from "react";
import { ConnectedAccount, Tag, SplitBriefSettings } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useIntegrationsState = () => {
  const { toast } = useToast();
  
  // Initialize with some sample data
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    {
      id: "1",
      provider: "gmail",
      email: "alex@company.com",
      tagId: "work",
      includeInCombined: true,
      connectedAt: new Date("2024-01-15"),
      type: "input"
    },
    {
      id: "2",
      provider: "slack",
      name: "Company Workspace",
      tagId: "work",
      includeInCombined: true,
      connectedAt: new Date("2024-01-20"),
      type: "input"
    }
  ]);

  const [tags, setTags] = useState<Tag[]>([
    {
      id: "work",
      name: "Work",
      color: "#3B82F6",
      emoji: "💼",
      splitBriefEnabled: false,
      splitBriefTime: "09:00",
      splitBriefEmail: true,
      splitBriefAudio: false,
      isDefault: true
    },
    {
      id: "personal",
      name: "Personal", 
      color: "#10B981",
      emoji: "👤",
      splitBriefEnabled: false,
      splitBriefTime: "08:00",
      splitBriefEmail: true,
      splitBriefAudio: false,
      isDefault: true
    }
  ]);

  const [showFirstTimeHelper, setShowFirstTimeHelper] = useState(true);

  const addAccount = useCallback((provider: string, type: 'input' | 'output' = 'input') => {
    const newAccount: ConnectedAccount = {
      id: `${Date.now()}`,
      provider,
      email: `user@${provider}.com`,
      tagId: provider.includes('gmail') && provider.includes('.com') ? 'personal' : 'work',
      includeInCombined: true,
      connectedAt: new Date(),
      type
    };
    
    setConnectedAccounts(prev => [...prev, newAccount]);
  }, []);

  const updateAccountTag = useCallback((accountId: string, tagId: string) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, tagId } : account
      )
    );
    
    toast({
      title: "Tag Updated",
      description: "Account tag has been updated successfully.",
    });
  }, [toast]);

  const toggleAccountInCombined = useCallback((accountId: string) => {
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId 
          ? { ...account, includeInCombined: !account.includeInCombined }
          : account
      )
    );
  }, []);

  const disconnectAccount = useCallback((accountId: string) => {
    setConnectedAccounts(prev => prev.filter(account => account.id !== accountId));
    toast({
      title: "Account Disconnected",
      description: "The account has been disconnected successfully.",
    });
  }, [toast]);

  const createTag = useCallback((name: string, color: string, emoji: string) => {
    const newTag: Tag = {
      id: `tag_${Date.now()}`,
      name,
      color,
      emoji,
      splitBriefEnabled: false,
      splitBriefTime: "09:00",
      splitBriefEmail: true,
      splitBriefAudio: false
    };
    
    setTags(prev => [...prev, newTag]);
    toast({
      title: "Tag Created",
      description: `"${name}" tag has been created successfully.`,
    });
    
    return newTag.id;
  }, [toast]);

  const updateTag = useCallback((tagId: string, updates: Partial<Tag>) => {
    setTags(prev => 
      prev.map(tag => 
        tag.id === tagId ? { ...tag, ...updates } : tag
      )
    );
    
    toast({
      title: "Tag Updated",
      description: "Tag has been updated successfully.",
    });
  }, [toast]);

  const deleteTag = useCallback((tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "Default tags cannot be deleted.",
        variant: "destructive"
      });
      return;
    }

    // Move accounts to default tag
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.tagId === tagId ? { ...account, tagId: 'work' } : account
      )
    );
    
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    
    toast({
      title: "Tag Deleted",
      description: "Tag has been deleted and accounts moved to default tag.",
    });
  }, [tags, toast]);

  const mergeTag = useCallback((sourceTagId: string, targetTagId: string) => {
    // Move all accounts from source to target
    setConnectedAccounts(prev => 
      prev.map(account => 
        account.tagId === sourceTagId ? { ...account, tagId: targetTagId } : account
      )
    );
    
    // Delete source tag
    setTags(prev => prev.filter(tag => tag.id !== sourceTagId));
    
    toast({
      title: "Tags Merged",
      description: "Tags have been merged successfully.",
    });
  }, [toast]);

  const updateSplitBriefSettings = useCallback((tagId: string, settings: Partial<SplitBriefSettings>) => {
    setTags(prev => 
      prev.map(tag => 
        tag.id === tagId 
          ? { 
              ...tag, 
              splitBriefEnabled: settings.enabled ?? tag.splitBriefEnabled,
              splitBriefTime: settings.time ?? tag.splitBriefTime,
              splitBriefEmail: settings.email ?? tag.splitBriefEmail,
              splitBriefAudio: settings.audio ?? tag.splitBriefAudio
            }
          : tag
      )
    );
  }, []);

  const dismissFirstTimeHelper = useCallback(() => {
    setShowFirstTimeHelper(false);
  }, []);

  return {
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
  };
};
