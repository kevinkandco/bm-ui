import { useState, useCallback, useEffect } from "react";
import { ConnectedAccount, Tag, SplitBriefSettings } from "./types";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";

const BaseURL = import.meta.env.VITE_API_HOST;

export const useIntegrationsState = () => {
  const { toast } = useToast();
  const { call } = useApi();
  
  // Initialize with some sample data
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([
    // {
    //   id: "1",
    //   provider: "gmail",
    //   email: "alex@company.com",
    //   tagId: "work",
    //   is_combined: true,
    //   connectedAt: new Date("2024-01-15"),
    //   type: "input"
    // },
    // {
    //   id: "2",
    //   provider: "slack",
    //   name: "Company Workspace",
    //   tagId: "work",
    //   is_combined: true,
    //   connectedAt: new Date("2024-01-20"),
    //   type: "input"
    // }
  ]);

  const [tags, setTags] = useState<Tag[]>([
    // {
    //   id: 1,
    //   name: "Work",
    //   color: "#3B82F6",
    //   emoji: "💼",
    //   splitBriefEnabled: false,
    //   splitBriefTime: "09:00",
    //   splitBriefEmail: true,
    //   splitBriefAudio: false,
    //   isDefault: true
    // },
    // {
    //   id: 2,
    //   name: "Personal", 
    //   color: "#10B981",
    //   emoji: "👤",
    //   splitBriefEnabled: false,
    //   splitBriefTime: "08:00",
    //   splitBriefEmail: true,
    //   splitBriefAudio: false,
    //   isDefault: true
    // }
  ]);

  const [showFirstTimeHelper, setShowFirstTimeHelper] = useState(true);
  const [loading, setLoading] = useState(false);

  const getProvider = useCallback(async (): Promise<void> => {
    setLoading(true);
    const DaysResponse = await call("get", "/api/settings/system-integrations", {
      showToast: false,
      returnOnFailure: false,
    });
    const TagsResponse = await call("get", "/api/settings/integrations/tags", {
      showToast: false,
      returnOnFailure: false,
    });

    if (DaysResponse?.data) {
      const data = DaysResponse?.data?.map((con) => ({...con, tagId: con?.tag?.id}))
      setConnectedAccounts(data);
    }

    if (TagsResponse?.data) {
      setTags(
        TagsResponse?.data?.map((tag) => ({
          id: tag.id,
          name: tag?.name,
          color: tag?.color,
          emoji: tag?.emoji,
          splitBriefTime: tag?.send_at,
          splitBriefEnabled: !!tag?.is_split,
          splitBriefEmail: !!tag?.delivery_email,
          splitBriefAudio: !!tag?.delivery_audio
        }))
      );
    }
    setLoading(false);
  }, [call]);
    
  useEffect(() => {
    getProvider();
  }, [getProvider]);

  const addAccount = useCallback((provider: string, type: 'input' | 'output' = 'input') => {
    

    const openAuthUrl = async (provider: string) => {
      const urls: Record<string, string> = {
        slack: `${BaseURL}/auth/redirect/slack?redirectURL=dashboard/settings`,
        google: `${BaseURL}/google/auth?redirectURL=dashboard/settings`,
        calendar: `${BaseURL}/calendar/auth`, // Add correct URLs as needed
        outlook: `${BaseURL}/outlook/auth`,
      };
      window.open(urls[provider], "_self");
    };

    if (provider === "slack") {
      if (provider === "slack") {
        openAuthUrl("slack");
      }
    } else if (provider === "google") {
        openAuthUrl("google");
    } else {
      const newAccount: ConnectedAccount = {
      id: Math.floor(Math.random() * 1000),
      provider: Math.floor(Math.random() * 3),
      email: `user@${provider}.com`,
      tagId: Math.floor(Math.random() * 3),
      is_combined: true,
      connectedAt: new Date(),
      type
    };
    
    setConnectedAccounts(prev => [...prev, newAccount]);
    }
  }, []);

  const updateAccountTag = useCallback(async (accountId: number, tagId: number) => {
    const response = await call("post", `/api/settings/system-integrations/${accountId}/select-tag `, {
      body: {
        tag_id: tagId
      },
      showToast: true,
      toastTitle: "Error",
      toastDescription: "There was an error updating tag. Please try again later.",
      toastVariant: "destructive",
    });

    if (!response) return;

    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, tagId } : account
      )
    );
    
    toast({
      title: "Tag Updated",
      description: "Account tag has been updated successfully.",
    });
  }, [toast, call]);

  const toggleAccountInCombined = useCallback(async (accountId: number) => {
    const is_combined = connectedAccounts.find(acc => acc.id === accountId).is_combined;
    const response = await call("post", `/api/settings/system-integrations/${accountId}/combine`, {
      body: {
        is_combined: !is_combined
      }
    })
    if(response)
      setConnectedAccounts(prev => 
        prev.map(account => 
          account.id === accountId 
            ? { ...account, is_combined: !account.is_combined }
            : account
        )
      );
  }, [connectedAccounts, call]);

  const disconnectAccount = useCallback(async (accountId: number) => {
    const response = await call(
      "get",
      `/api/settings/system-integrations/${accountId}/disconnect`,
      {
        showToast: true,
        toastTitle: "Failed to Disconnect",
        toastDescription: `Could not disconnect because of an error. Please try again later.`,
      }
    );

    if (response?.success) {
      setConnectedAccounts(prev => prev.filter(account => account.id !== accountId));
      toast({
        title: "Account Disconnected",
        description: "The account has been disconnected successfully.",
      });
    }
  }, [toast, call]);

  const updateAccountName = useCallback(async (accountId: string | number, customName: string) => {
    const response = await call("post", `/api/settings/system-integrations/${accountId}/update-name`, {
      body: {name: customName},
      showToast: true,
      toastTitle: "Name Update Failed",
      toastDescription: "Name update failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false
    }) 
    
    if (!response) return;

    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? { ...account, name: customName } : account
      )
    );
    
    toast({
      title: "Account Name Updated",
      description: "Account name has been updated successfully.",
    });
  }, [toast, call]);

  const createTag = useCallback(async (name: string, color: string, emoji: string, accountId: number) => {
    const newTag: Tag = {
      name,
      color,
      emoji,
      splitBriefEnabled: false,
      splitBriefTime: "09:00",
      splitBriefEmail: true,
      splitBriefAudio: false
    };

    const response = await call("post", `/api/settings/integrations/${accountId}/tag`, {
      body: {
        name,
        color,
        emoji,
      },
      showToast: true,
      toastTitle: "Tag Creation Failed",
      toastDescription: "Tag creation failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false
    }) 
    
    if (!response) return;

    if (!response?.data) return;

    setConnectedAccounts(prev => 
      prev.map(account => 
        account.id === accountId ? {...response?.data, tagId: response?.data?.tag?.id} : account
      )
    );

    setTags(prev => [...prev, response?.data?.tag]);
    toast({
      title: "Tag Created",
      description: `"${name}" tag has been created successfully.`,
    });
    
    return newTag.id;
  }, [toast, call]);

  const updateTag = useCallback(async (tagId: number, updates: Partial<Tag>) => {
    const response = await call("post", `/api/settings/integrations/${tagId}/update-tag`, {
      body: updates,
      showToast: true,
      toastTitle: "Tag Update Failed",
      toastDescription: "Tag Update failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false
    }) 
    
    if (!response) return;

    setTags(prev => 
      prev.map(tag => 
        tag.id === tagId ? { ...tag, ...updates } : tag
      )
    );
    
    toast({
      title: "Tag Updated",
      description: "Tag has been updated successfully.",
    });
  }, [toast, call]);

  const deleteTag = useCallback(async (tagId: number) => {
    const response = await call("delete", `/api/settings/integrations/${tagId}/delete-tag`, {
      showToast: true,
      toastTitle: "Tag Deletion Failed",
      toastDescription: "Tag Deletion failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false
    }) 
    
    if (!response) return;

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
        account.tagId === tagId ? { ...account, tagId: response?.data || null } : account
      )
    );
    
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    
    toast({
      title: "Tag Deleted",
      description: "Tag has been deleted and accounts moved to default tag.",
    });
  }, [tags, toast, call]);

  const mergeTag = useCallback((sourceTagId: number, targetTagId: number) => {
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

  const updateSplitBriefSettings = useCallback(async(tagId: number, settings: Partial<SplitBriefSettings>) => {
    const tag = tags.find(t => t.id === tagId);
    const body = {
      is_split: settings.enabled ?? tag.splitBriefEnabled,
      send_at: settings.time ?? tag.splitBriefTime,
      delivery_email: settings.email ?? tag.splitBriefEmail,
      delivery_audio: settings.audio ?? tag.splitBriefAudio
    }

    console.log(body, ": body");

    const response = await call("post", `/api/settings/integrations/${tagId}/update-tag`, {
      body,
      showToast: true,
      toastTitle: "Tag Update Failed",
      toastDescription: "Tag Update failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false
    }) 
    
    if (!response) return;


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
  }, [tags]);

  const dismissFirstTimeHelper = useCallback(() => {
    setShowFirstTimeHelper(false);
  }, []);

  return {
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
    updateSplitBriefSettings,
    dismissFirstTimeHelper,
    loading
  };
};
