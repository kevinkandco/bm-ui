import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ProgressIndicator from "./ProgressIndicator";
import { X, Plus, BellOff, Hash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import suggestedTopicsData from '@/data/suggestedTopics.json';
import { PriorityChannels } from "./priority-channels/types";
import { useApi } from "@/hooks/useApi";
import { ConnectedAccount } from "../settings/types";

const BaseURL = import.meta.env.VITE_API_HOST;

interface IgnoreConfigStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    ignoreChannels: string[];
    ignoreKeywords: string[];
    includeIgnoredInSummary: boolean;
    integrations: any[];
    [key: string]: any;
  };
  connectedAccount: ConnectedAccount[];
}

const IgnoreConfigStep = ({
  onNext,
  onBack,
  updateUserData,
  userData,
  connectedAccount
}: IgnoreConfigStepProps) => {
  const [selectedTab, setSelectedTab] = useState<"channel" | "keyword">(
    "channel"
  );
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<PriorityChannels[] | string[]>([]);

  const [ignoreChannels, setIgnoreChannels] = useState<string[]>(
    userData.ignoreChannels || []
  );
  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>(
    userData.ignoreKeywords || []
  );
  const [includeInSummary, setIncludeInSummary] = useState<boolean>(
    userData.includeIgnoredInSummary || false
  );
  // Mock Slack channels - in a real app, these would be fetched from Slack API
  const [slackChannels, setSlackChannels] = useState<PriorityChannels[] | null>(null);
  const [suggestedTopics] = useState(suggestedTopicsData.map((topic) => topic.name));

  const inputRef = useRef<HTMLInputElement>(null);
  const { call } = useApi();
  const slackId = connectedAccount?.find(c => c?.provider_name?.toLowerCase() === "slack")?.id;

  const getAllChannel = useCallback(async (): Promise<void> => {
    const response = await call("get", `/api/slack/channels/${slackId}`);

    if (!response) {
      console.error("Failed to fetch Slack channels");
      return;
    }

    const allChannels: PriorityChannels[] = response;

    const extraChannels =
      userData?.ignoreChannels?.filter((channelName: string) => {
        return !allChannels?.some((c) => c.name === channelName);
      })?.map((channelName: string) => ({
        id: channelName,
        name: channelName,
      })) ?? [];

    const combinedChannels = [...allChannels, ...extraChannels];

    setSlackChannels(combinedChannels);
  }, [call, userData, slackId]);


  useEffect(() => {
    if(slackId) getAllChannel();
  }, [slackId, getAllChannel]);

  const hasSlackIntegration = userData.integrations?.some(
    (integration: any) =>
      integration.type === "slack" || integration === "slack"
  );

  // Filter channels based on input
  useEffect(() => {
    if (selectedTab === "channel" && isInputFocused) {
      const filtered = slackChannels?.filter((channel) =>
        channel?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
      )?.filter((channel) =>
        !userData?.priorityChannels?.some(
          (priority: string) => priority?.toLowerCase() === channel?.name?.toLowerCase()
        )
      )?.filter((channel) =>
        !ignoreChannels?.some(
          (ignore: string) => ignore?.toLowerCase() === channel?.name?.toLowerCase()
        )
      );
      setSearchResults(filtered);
    }
     else if (selectedTab === "keyword" && isInputFocused) {
      const filtered  = suggestedTopics?.filter((topic) =>
        topic?.toLowerCase()?.includes(inputValue.toLowerCase())
      )?.filter((topic) =>
        !userData.priorityTopics?.some(
          (priority: string) => priority.toLowerCase() === topic.toLowerCase()
        )
      )?.filter((topic) =>
        !ignoreKeywords?.some(
          (ignore: string) => ignore.toLowerCase() === topic.toLowerCase()
        )
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, isInputFocused, selectedTab, slackChannels, userData, suggestedTopics, ignoreKeywords, ignoreChannels]);

  const addItem = () => {
    if (!inputValue?.trim()) return;

    if (selectedTab === "channel") {
      // Check if channel already exists
      if (ignoreChannels?.includes(inputValue.trim())) {
        return;
      }
      setSlackChannels((prev) => [...prev, {id: inputValue.trim(), name: inputValue.trim()}]);
      setIgnoreChannels((prev) => [...prev, inputValue.trim()]);
    } else if (selectedTab === "keyword") {
      // Check if keyword already exists
      if (ignoreKeywords?.includes(inputValue.trim())) {
        return;
      }

      setIgnoreKeywords((prev) => [...prev, inputValue.trim()]);
    }

    setInputValue("");
  };

  const selectChannel = (channel: string) => {
    if (!ignoreChannels.includes(channel)) {
      setIgnoreChannels((prev) => [...prev, channel]);
    }
    setInputValue("");
    setSearchResults([]);
    setIsInputFocused(false);
  };

    const selectKeyword = (topic: string) => {
    if (!ignoreKeywords.includes(topic)) {
      setIgnoreKeywords((prev) => [...prev, topic]);
    }
    setInputValue("");
    setSearchResults([]);
    setIsInputFocused(false);
  };

  const removeItem = (type: "channel" | "keyword", value: string) => {
    if (type === "channel") {
      setIgnoreChannels((prev) => prev?.filter((item) => item !== value));
    } else if (type === "keyword") {
      setIgnoreKeywords((prev) => prev?.filter((item) => item !== value));
    }
  };

  const handleContinue = () => {
    updateUserData({
      ignoreChannels,
      ignoreKeywords,
      includeIgnoredInSummary: includeInSummary,
    });
    onNext();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setIsInputFocused(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Render selected items based on current tab
  const renderSelectedItems = () => {
    
    if (selectedTab === "channel" && ignoreChannels?.length > 0) {
      const channels: PriorityChannels[] = slackChannels?.filter(channel => ignoreChannels?.includes(channel?.name));
      return (
        <div className="flex flex-wrap gap-2 pt-3 mt-2">
          {channels?.map((channel) => (
            <div
              key={channel?.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white"
            >
              {channel?.channel_type ? <Lock size={16} className="text-glass-blue/80" /> : <Hash size={16} className="text-glass-blue/80" />}
              <span>{channel?.name}</span>
              <button
                onClick={() => removeItem("channel", channel?.name)}
                className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      );
    } else if (selectedTab === "keyword" && ignoreKeywords?.length > 0) {
      return (
        <div className="flex flex-wrap gap-2 pt-3 mt-2">
          {ignoreKeywords?.map((keyword) => (
            <div
              key={keyword}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white"
            >
              <BellOff size={14} className="text-glass-blue/80" />
              <span>{keyword}</span>
              <button
                onClick={() => removeItem("keyword", keyword)}
                className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={5} totalSteps={7} />

      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-off-white tracking-tighter">
          Configure what to ignore
        </h2>
        <p className="text-off-white/80">
          Tell us what to filter out from your briefs to keep them focused on
          what matters.
        </p>
      </div>

      <div className="flex border-b border-white/20">
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "channel"
              ? "text-glass-blue"
              : "text-off-white/70 hover:text-off-white"
          )}
          onClick={() => setSelectedTab("channel")}
        >
          <div className="flex items-center gap-2">
            <Hash size={16} />
            <span>Channels</span>
          </div>
          {selectedTab === "channel" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-glass-blue" />
          )}
        </button>

        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "keyword"
              ? "text-glass-blue"
              : "text-off-white/70 hover:text-off-white"
          )}
          onClick={() => setSelectedTab("keyword")}
        >
          <div className="flex items-center gap-2">
            <BellOff size={16} />
            <span>Keywords</span>
          </div>
          {selectedTab === "keyword" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-glass-blue" />
          )}
        </button>
      </div>

      <div className="space-y-6">
        {selectedTab === "channel" && (
          <div className="space-y-3">
            <Label htmlFor="ignore-channel" className="text-off-white">
              Ignore channels
            </Label>
            <p className="text-sm text-off-white/70 -mt-1">
              We'll exclude these Slack channels or email folders from your
              brief (like #random or social updates).
            </p>
            <div className="flex gap-2 relative">
              <div className="relative flex-grow">
                <Input
                  ref={inputRef}
                  id="ignore-channel"
                  placeholder="Enter channel name (e.g. #random)"
                  autoComplete="off"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem()}
                  onFocus={() => setIsInputFocused(true)}
                  className="bg-white/15 border-white/20 text-off-white placeholder:text-white placeholder:opacity-70 w-full"
                />

                {isInputFocused && searchResults &&searchResults?.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                    {searchResults?.map((channel: PriorityChannels) => (
                      <div
                        key={channel.id}
                        onClick={() => selectChannel(channel.name)}
                        className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                      >
                        {channel?.channel_type ? <Lock size={16} className="text-glass-blue/80" /> : <Hash size={16} className="text-glass-blue/80" />}
                        <span className="text-off-white">{channel.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={addItem} variant="outline" className="shrink-0">
                <Plus size={16} />
                Add
              </Button>
            </div>

            {/* Always render selected channels for immediate feedback */}
            {renderSelectedItems()}
          </div>
        )}

        {selectedTab === "keyword" && (
          <div className="space-y-3">
            <Label htmlFor="ignore-keyword" className="text-off-white">
              Ignore keywords
            </Label>
            <p className="text-sm text-off-white/70 -mt-1">
              We'll filter out messages containing these keywords or phrases.
            </p>
            <div className="flex gap-2 relative">
              <div className="relative flex-grow">
              <Input
                ref={inputRef}
                id="ignore-keyword"
                placeholder="Enter keyword to ignore"
                autoComplete="off"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                onFocus={() => setIsInputFocused(true)}
                className="bg-white/15 border-white/20 text-off-white placeholder:text-white placeholder:opacity-70"
              />

                {isInputFocused && searchResults && searchResults?.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                    {searchResults?.map((topic: string) => (
                      <div
                        key={topic}
                        onClick={() => selectKeyword(topic)}
                        className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                      >
                        <Hash size={14} className="text-glass-blue/80" />
                        <span className="text-off-white">{topic}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>
              <Button onClick={addItem} variant="outline" className="shrink-0">
                <Plus size={16} />
                Add
              </Button>
            </div>

            {/* Always render selected keywords for immediate feedback */}
            {renderSelectedItems()}
          </div>
        )}

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="include-in-summary"
            checked={includeInSummary}
            onCheckedChange={setIncludeInSummary}
            className="data-[state=checked]:bg-glass-blue"
          />
          <Label
            htmlFor="include-in-summary"
            className="text-off-white/80 cursor-pointer"
          >
            Still include ignored items in summaries (but with lower priority)
          </Label>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button
          onClick={onBack}
          variant="ghost"
          size="none"
          className="text-text-secondary hover:text-text-primary"
        >
          Back
        </Button>
        <Button onClick={handleContinue} className="neon-button">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default IgnoreConfigStep;
