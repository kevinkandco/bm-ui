import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Archive, Tag, AlertCircle } from "lucide-react";
import { SettingsTabProps } from "./types";
import FancyLoader from "./FancyLoader";

const EmailAISettings = ({
  providerData,
  setProviderData,
  SyncLoading,
  syncData,
  loadingProviderData,
  provider,
}: SettingsTabProps) => {
  useEffect(() => {
    setProviderData((prev) => {
      return {
        ...prev,
        aiFeatures: {
          autoLabel: prev?.aiFeatures?.autoLabel ?? false,
          autoSort: prev?.aiFeatures?.autoSort ?? false,
          autoArchive: prev?.aiFeatures?.autoArchive ?? false,
          priorityOnly: prev?.aiFeatures?.priorityOnly ?? false,
        },
      };
    });
  }, [setProviderData]);

  const handleSettingChange = (key: string, value: boolean) => {
    setProviderData((prev) => ({
      ...prev,
      aiFeatures: {
        ...prev?.aiFeatures,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary">How it works</h3>
            <p className="text-sm text-text-secondary mt-1">
              Our AI analyzes your emails to identify priorities, automatically
              organizing your inbox so you only see what matters most.
            </p>
          </div>
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary">AI Features</h3>
        {/* Auto-labeling */}
        {loadingProviderData ? (
          <FancyLoader />
        ) : (
          <>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-text-secondary" />
                    <Label className="text-base font-medium">
                      Auto-Label Emails
                    </Label>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Automatically add labels like "Priority", "Meeting",
                    "Invoice", etc.
                  </p>
                </div>
                <Switch
                  checked={providerData?.aiFeatures?.autoLabel}
                  onCheckedChange={(checked) =>
                    handleSettingChange("autoLabel", checked)
                  }
                />
              </div>

              {providerData?.aiFeatures?.autoLabel && (
                <div className="ml-6 space-y-2">
                  <p className="text-xs text-text-secondary">
                    Common labels that will be applied:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Priority",
                      "Meeting",
                      "Action Required",
                      "Invoice",
                      "Newsletter",
                      "Spam",
                    ].map((label) => (
                      <Badge
                        key={label}
                        variant="secondary"
                        className="text-xs"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Separator />
            {/* Smart Sorting */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-secondary" />
                  <Label className="text-base font-medium">Smart Sorting</Label>
                </div>
                <p className="text-sm text-text-secondary">
                  Organize emails by importance, moving non-priorities to
                  separate folders
                </p>
              </div>
              <Switch
                checked={providerData?.aiFeatures?.autoSort}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoSort", checked)
                }
              />
            </div>
            <Separator />
            {/* Auto-archiving */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-text-secondary" />
                  <Label className="text-base font-medium">
                    Auto-Archive Non-Priorities
                  </Label>
                </div>
                <p className="text-sm text-text-secondary">
                  Automatically archive low-priority emails after 7 days (never
                  deleted)
                </p>
              </div>
              <Switch
                checked={providerData?.aiFeatures?.autoArchive}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoArchive", checked)
                }
              />
            </div>
            <Separator />
            {/* Priority-only mode */}
            <div className="flex items-center justify-between !mb-4">
              <div className="space-y-1">
                <Label className="text-base font-medium">
                  Priority-Only Inbox
                </Label>
                <p className="text-sm text-text-secondary">
                  Only show high-priority emails in your main inbox view
                </p>
              </div>
              <Switch
                checked={providerData?.aiFeatures?.priorityOnly}
                onCheckedChange={(checked) =>
                  handleSettingChange("priorityOnly", checked)
                }
              />
            </div>{" "}
          </>
        )}
      </div>
    </div>
  );
};

export default EmailAISettings;
