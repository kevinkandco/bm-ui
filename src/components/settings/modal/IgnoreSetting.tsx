import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SettingsTabProps } from "./types";
import { Button } from "@/components/ui/button";
import { PriorityChannels } from "@/components/onboarding/priority-channels/types";
import { useApi } from "@/hooks/useApi";
import suggestedTopicsData from "@/data/suggestedTopics.json";
import { BellOff, Hash, Lock, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import FancyLoader from "./FancyLoader";

const IgnoreSetting = ({
  slackData,
  setSlackData,
  SyncLoading,
  syncData,
  provider
}: SettingsTabProps) => {
  const channelActive = useMemo(() => ['slack'], []);
  const keywordActive = useMemo(() => ['slack', 'google'], []);

  const [selectedTab, setSelectedTab] = useState<"channel" | "keyword">(
    provider.name === "slack" ? "channel" : "keyword"
  );
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<
    PriorityChannels[] | string[]
  >([]);
  // Mock Slack channels - in a real app, these would be fetched from Slack API
  const [slackChannels, setSlackChannels] = useState<PriorityChannels[] | null>(
    null
  );
  const [suggestedTopics] = useState(
    suggestedTopicsData.map((topic) => topic.name)
  );
  const [loadingIgnore, setLoadingIgnore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const { call } = useApi();

  const getAllChannel = useCallback(async (): Promise<void> => {
    setLoadingIgnore(true);
    const response = await call("get", "/api/slack/channels");

    if (!response) {
      console.error("Failed to fetch Slack channels");
      return;
    }

    const allChannels: PriorityChannels[] = response;

    const extraChannels =
      slackData?.ignoreChannels
        ?.filter((channelName: string) => {
          return !allChannels?.some((c) => c.name === channelName);
        })
        ?.map((channelName: string) => ({
          id: channelName,
          name: channelName,
        })) ?? [];

    const combinedChannels = [...allChannels, ...extraChannels];

    setSlackChannels(combinedChannels);
    setLoadingIgnore(false);
  }, [call, slackData]);

  useEffect(() => {
    if (channelActive.includes(provider?.name?.toLowerCase() || '')) {
      getAllChannel();
    }
  }, [getAllChannel, channelActive, provider?.name]);

  // Filter channels based on input
  useEffect(() => {
    if (selectedTab === "channel" && isInputFocused && channelActive.includes(provider?.name?.toLowerCase() || '')) {
      const filtered = slackChannels
        ?.filter((channel) =>
          channel?.name?.toLowerCase()?.includes(inputValue.toLowerCase())
        )
        ?.filter(
          (channel) =>
            !slackData?.priorityChannels?.some(
              (priority: string) =>
                priority?.toLowerCase() === channel?.name?.toLowerCase()
            )
        )
        ?.filter(
          (channel) =>
            !slackData?.ignoreChannels?.some(
              (ignore: string) =>
                ignore?.toLowerCase() === channel?.name?.toLowerCase()
            )
        );
      setSearchResults(filtered);
    } else if (selectedTab === "keyword" && isInputFocused && keywordActive.includes(provider?.name?.toLowerCase() || '')) {
      const filtered = suggestedTopics
        ?.filter((topic) =>
          topic?.toLowerCase()?.includes(inputValue.toLowerCase())
        )
        ?.filter(
          (topic) =>
            !slackData?.priorityTopics?.some(
              (priority: string) =>
                priority.toLowerCase() === topic.toLowerCase()
            )
        )
        ?.filter(
          (topic) =>
            !slackData?.ignoreKeywords?.some(
              (ignore: string) => ignore.toLowerCase() === topic.toLowerCase()
            )
        );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [
    inputValue,
    isInputFocused,
    selectedTab,
    slackChannels,
    slackData,
    suggestedTopics,
    slackData?.ignoreKeywords,
    slackData?.ignoreChannels,
    provider?.name,
    channelActive,
    keywordActive
  ]);

  const addItem = () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    if (selectedTab === "channel" && channelActive.includes(provider?.name?.toLowerCase() || '')) {
      if (slackData?.ignoreChannels?.includes(trimmedInput)) {
        return;
      }
      // Update slackData?.ignoreChannels with new channel
      setSlackData((prev) => ({
        ...prev,
        ignoreChannels: [...(prev.ignoreChannels || []), trimmedInput],
      }));
      setSlackChannels((prev) => [
        ...(prev || []),
        { id: trimmedInput, name: trimmedInput },
      ]);
    } else if (selectedTab === "keyword" && keywordActive.includes(provider?.name?.toLowerCase() || '')) {
      if (slackData?.ignoreKeywords?.includes(trimmedInput)) {
        return;
      }
      // Update slackData?.ignoreKeywords with new keyword
      setSlackData((prev) => ({
        ...prev,
        ignoreKeywords: [...(prev.ignoreKeywords || []), trimmedInput],
      }));
    }

    setInputValue("");
  };

 const selectChannel = (channel: string) => {
  if (!slackData?.ignoreChannels?.includes(channel) && channelActive.includes(provider?.name?.toLowerCase() || '')) {
    setSlackData((prev) => ({
      ...prev,
      ignoreChannels: [...(prev.ignoreChannels || []), channel],
    }));
  }
  setInputValue("");
  setSearchResults([]);
  setIsInputFocused(false);
};

const selectKeyword = (topic: string) => {
  if (!slackData?.ignoreKeywords?.includes(topic) && keywordActive.includes(provider?.name?.toLowerCase() || '')) {
    setSlackData((prev) => ({
      ...prev,
      ignoreKeywords: [...(prev.ignoreKeywords || []), topic],
    }));
  }
  setInputValue("");
  setSearchResults([]);
  setIsInputFocused(false);
};


  const removeItem = (type: "channel" | "keyword", value: string) => {
    if (type === "channel" && channelActive.includes(provider?.name?.toLowerCase() || '')) {
      setSlackData((prev) => ({
        ...prev,
        ignoreChannels: prev.ignoreChannels?.filter((item) => item !== value),
      }));
    } else if (type === "keyword" && keywordActive.includes(provider?.name?.toLowerCase() || '')) {
      setSlackData((prev) => ({
        ...prev,
        ignoreKeywords: prev.ignoreKeywords?.filter((item) => item !== value),
      }));
    }
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

  const handleIncludeInSummary = (status: boolean) => {
    setSlackData((prev) => ({ ...prev, includeIgnoredInSummary: status }));
  };

  const renderSelectedItems = () => {
    if (selectedTab === "channel" && slackData?.ignoreChannels?.length > 0 && channelActive.includes(provider?.name?.toLowerCase() || '')) {
      const channels: PriorityChannels[] = slackChannels?.filter((channel) =>
        slackData?.ignoreChannels?.includes(channel?.name)
      );
      return (
        <div className="flex flex-wrap gap-2 pt-3 mt-2">
          {channels?.map((channel) => (
            <div
              key={channel?.id}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white"
            >
              {channel?.channel_type ? (
                <Lock size={16} className="text-glass-blue/80" />
              ) : (
                <Hash size={16} className="text-glass-blue/80" />
              )}
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
    } else if (selectedTab === "keyword" && slackData?.ignoreKeywords?.length > 0 && keywordActive.includes(provider?.name?.toLowerCase() || '')) {
      return (
        <div className="flex flex-wrap gap-2 pt-3 mt-2">
          {slackData?.ignoreKeywords?.map((keyword) => (
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
    <>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-white mb-4">
          Configure what to ignore
        </h2>
        <Button
          variant="outline"
          size="none"
          onClick={syncData}
          disabled={SyncLoading}
          className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white px-2 py-1"
        >
          {SyncLoading && (
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {SyncLoading ? "Syncing" : "Sync"}
        </Button>
      </div>
      <p className="text-white/60 text-sm">
        Tell us what to filter out from your briefs to keep them focused on what
        matters.
      </p>
      <div className="flex border-b border-white/20">
        {channelActive.includes(provider?.name?.toLowerCase() || '') && <button
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
        </button>}

        {keywordActive.includes(provider?.name?.toLowerCase() || '') && <button
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
        </button>}
      </div>
      {loadingIgnore ? (
        <FancyLoader />
      ) : (
        <div className="space-y-6">
          {(selectedTab === "channel" && channelActive.includes(provider?.name?.toLowerCase() || '')) && (
            <div className="space-y-3 mt-4">
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

                  {isInputFocused &&
                    searchResults &&
                    searchResults?.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                        {searchResults?.map((channel: PriorityChannels) => (
                          <div
                            key={channel.id}
                            onClick={() => selectChannel(channel.name)}
                            className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                          >
                            {channel?.channel_type ? (
                              <Lock size={16} className="text-glass-blue/80" />
                            ) : (
                              <Hash size={16} className="text-glass-blue/80" />
                            )}
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

          {(selectedTab === "keyword" && keywordActive.includes(provider?.name?.toLowerCase() || '')) && (
            <div className="space-y-3 mt-4">
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

                  {isInputFocused &&
                    searchResults &&
                    searchResults?.length > 0 && (
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
              checked={slackData?.includeIgnoredInSummary}
              onCheckedChange={handleIncludeInSummary}
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
      )}

    </>
  );
};

export default IgnoreSetting;
