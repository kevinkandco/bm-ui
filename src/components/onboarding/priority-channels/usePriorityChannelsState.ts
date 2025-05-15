
import { useState, useEffect } from "react";

export function usePriorityChannelsState(initialChannels: string[] = []) {
  const [priorityChannels, setPriorityChannels] = useState<string[]>(initialChannels);
  
  // All available Slack channels
  const [allSlackChannels] = useState([
    "#general",
    "#random",
    "#announcements",
    "#team-dev",
    "#marketing",
    "#sales",
    "#support",
    "#watercooler",
    "#project-alpha",
    "#design",
    "#engineering",
    "#hr"
  ]);
  
  // Filtered list of slack channels (excluding selected ones)
  const [slackChannels, setSlackChannels] = useState<string[]>([]);
  
  // Update available channels whenever priority channels change
  useEffect(() => {
    setSlackChannels(allSlackChannels.filter(channel => !priorityChannels.includes(channel)));
  }, [priorityChannels, allSlackChannels]);
  
  const addChannel = (channelName: string) => {
    if (!channelName.trim()) return;
    
    // Check if channel already exists
    if (priorityChannels.includes(channelName.trim())) {
      return;
    }
    
    setPriorityChannels(prev => [...prev, channelName.trim()]);
  };
  
  const selectChannel = (channel: string) => {
    if (!priorityChannels.includes(channel)) {
      setPriorityChannels(prev => [...prev, channel]);
    }
  };
  
  const removeChannel = (channel: string) => {
    setPriorityChannels(prev => prev.filter(item => item !== channel));
  };
  
  return {
    priorityChannels,
    slackChannels,
    allSlackChannels,
    addChannel,
    selectChannel,
    removeChannel
  };
}
