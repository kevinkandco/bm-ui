
import { useState, useEffect } from "react";

export function usePriorityChannelsState(initialChannels: string[] = []) {
  const [priorityChannels, setPriorityChannels] = useState<string[]>(initialChannels);
  
  // Mock Slack channels - in real implementation, would be fetched from Slack API
  const [slackChannels] = useState([
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
    addChannel,
    selectChannel,
    removeChannel
  };
}
