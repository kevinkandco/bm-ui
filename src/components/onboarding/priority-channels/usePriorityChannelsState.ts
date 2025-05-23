import { useState, useEffect, useCallback } from "react";
import Http from "@/Http";
import { useNavigate } from "react-router-dom";
import { PriorityChannels } from "./types";

const BaseURL = import.meta.env.VITE_API_HOST;

export function usePriorityChannelsState(initialChannels: string[] = []) {
  const [priorityChannels, setPriorityChannels] = useState<string[]>(initialChannels);
  const navigate = useNavigate();
  const [allSlackChannels, setAllSlackChannels] = useState<PriorityChannels[] | null>(null);

  const getAllChannel = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      Http.setBearerToken(token);

      const response = await Http.callApi("get",`${BaseURL}/api/slack/channels`);
      if (response) {
        setAllSlackChannels(response?.data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [navigate]);

  useEffect(() => {
    getAllChannel();
  }, [getAllChannel]);

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
