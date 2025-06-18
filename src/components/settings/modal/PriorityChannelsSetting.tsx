import { PriorityChannels } from "@/components/onboarding/priority-channels/types";
import { Button } from "@/components/ui/button";
import { useApi } from "@/hooks/useApi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SettingsTabProps } from "./types";
import { Label } from "@/components/ui/label";
import { ChannelInput } from "@/components/onboarding/priority-channels/ChannelInput";
import { SelectedChannels } from "@/components/onboarding/priority-channels/SelectedChannels";
import { SlackChannelsList } from "@/components/onboarding/priority-channels/SlackChannelsList";
import { MessageSquare } from "lucide-react";
import FancyLoader from "./FancyLoader";

const PriorityChannelsSetting = ({
  slackData,
  setSlackData,
  SyncLoading,
  syncData,
  provider
}: SettingsTabProps) => {
  const [allSlackChannels, setAllSlackChannels] = useState<
    PriorityChannels[] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingChannels, setLoadingChannels] = useState(false);
  const { call } = useApi();

  const getAllChannel = useCallback(async (): Promise<void> => {
    setLoadingChannels(true);
    const response = await call("get", `/api/slack/channels/${provider?.id}`);

    if (response) {
      setAllSlackChannels(response);
    }
    setLoadingChannels(false);
  }, [call, provider?.id]);

  useEffect(() => {
    getAllChannel();
  }, [getAllChannel]);

  // Filtered list of slack channels (excluding selected ones)
  const [slackChannels, setSlackChannels] = useState<PriorityChannels[]>([]);

  // Update available channels whenever priority channels change
  useEffect(() => {
    const priority = slackData?.priorityChannels ?? [];

    setSlackChannels(
      allSlackChannels?.filter(
        (channel) => !priority.some((c) => c === channel?.name)
      ) ?? []
    );
  }, [slackData?.priorityChannels, allSlackChannels]);

  const addChannel = (channelName: string) => {
    const trimmed = channelName.trim();
    if (!trimmed || slackData?.priorityChannels?.includes(trimmed)) return;

    setAllSlackChannels((prev) => [
      ...(prev ?? []),
      { id: trimmed, name: trimmed },
    ]);

    setSlackData((prev) => ({
      ...prev,
      priorityChannels: [...(prev.priorityChannels ?? []), trimmed],
    }));
  };

  const selectChannel = (channel: string) => {
    const trimmed = channel.trim();
    if (!slackData?.priorityChannels?.includes(trimmed)) {
      setSlackData((prev) => ({
        ...prev,
        priorityChannels: [...(prev.priorityChannels ?? []), trimmed],
      }));
    }
  };

  const removeChannel = (channel: string) => {
    setSlackData((prev) => ({
      ...prev,
      priorityChannels:
        prev.priorityChannels?.filter((item) => item !== channel) ?? [],
    }));
  };

  const filteredChannels = useMemo(() => {
    if (!searchQuery) return slackChannels;
    const q = searchQuery.toLowerCase();
    return slackChannels.filter((channel) =>
      channel.name.toLowerCase().includes(q)
    );
  }, [searchQuery, slackChannels]);

  return (
    <>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-white mb-4">
          Which channels are critical?
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
      <p className="text-text-secondary">
        Mark your most important channels. We'll highlight updates from these
        channels in your brief.
      </p>
      {loadingChannels ? (
          <FancyLoader />
        ) : (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="priority-channel" className="text-text-primary">
              Add important channels
            </Label>

            <ChannelInput
              onAddChannel={addChannel}
              onSelectChannel={selectChannel}
              existingChannels={slackData?.priorityChannels ?? []}
              availableChannels={slackChannels}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <SelectedChannels
              channels={slackData?.priorityChannels ?? []}
              slackChannels={allSlackChannels}
              onRemoveChannel={removeChannel}
            />
          </div>

          {/* Slack channels section */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary">
              <span className="flex items-center gap-2">
                <MessageSquare size={18} className="text-accent-primary" />
                Your Slack Channels
              </span>
            </h3>

            <SlackChannelsList
              slackChannels={filteredChannels}
              priorityChannels={slackData?.priorityChannels ?? []}
              onSelectChannel={selectChannel}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PriorityChannelsSetting;
