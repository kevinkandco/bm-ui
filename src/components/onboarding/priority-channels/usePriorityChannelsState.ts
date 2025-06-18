import { useState, useEffect, useCallback } from "react";
import { PriorityChannels } from "./types";
import { useApi } from "@/hooks/useApi";

export function usePriorityChannelsState(id: number, initialChannels: string[] = []) {
  const [priorityChannels, setPriorityChannels] = useState<string[]>(initialChannels);
  const [allSlackChannels, setAllSlackChannels] = useState<PriorityChannels[] | null>(null);
  const { call } = useApi();

  const getAllChannel = useCallback(async (): Promise<void> => {
    const response = await call("get", `/api/slack/channels/${id}`);

    if (response) {
      setAllSlackChannels(response);
    }
  }, [id, call]);


  useEffect(() => {
    if(id) getAllChannel();
  }, [id, getAllChannel]);

  // Filtered list of slack channels (excluding selected ones)
  const [slackChannels, setSlackChannels] = useState<PriorityChannels[]>([]);

  // Update available channels whenever priority channels change
  useEffect(() => {
    setSlackChannels(
      allSlackChannels?.filter((channel) => !priorityChannels.some((c) => c === channel?.name))
    );
  }, [priorityChannels, allSlackChannels]);

  const addChannel = (channelName: string) => {
    if (!channelName?.trim()) return;

    // Check if channel already exists
    if (priorityChannels.includes(channelName?.trim())) {
      return;
    }
    setAllSlackChannels((prev) => [...prev, {id: channelName?.trim(),name: channelName?.trim()}]);
    setPriorityChannels((prev) => [...prev, channelName?.trim()]);
  };

  const selectChannel = (channel: string) => {
    if (!priorityChannels.includes(channel)) {
      setPriorityChannels((prev) => [...prev, channel]);
    }
  };

  const removeChannel = (channel: string) => {
    setPriorityChannels((prev) => prev?.filter((item) => item !== channel));
  };

  return {
    priorityChannels,
    slackChannels,
    allSlackChannels,
    addChannel,
    selectChannel,
    removeChannel,
  };
}
