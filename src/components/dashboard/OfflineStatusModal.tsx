import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface OfflineSchedule {
  startTime: Date;
  endTime: Date;
  slackSync: boolean;
  teamsSync: boolean;
  slackMessage: string;
  teamsMessage: string;
  enableDND: boolean;
}

interface OfflineStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (schedule: OfflineSchedule) => void;
}

export function OfflineStatusModal({
  isOpen,
  onClose,
  onSchedule
}: OfflineStatusModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<string>("30min");
  const [customDate, setCustomDate] = useState<Date>();
  const [customTime, setCustomTime] = useState<string>("17:00");
  const [slackSync, setSlackSync] = useState(true);
  const [teamsSync, setTeamsSync] = useState(false);
  const [slackMessage, setSlackMessage] = useState("Currently offline - will respond later");
  const [teamsMessage, setTeamsMessage] = useState("Currently offline - will respond later");
  const [enableDND, setEnableDND] = useState(true);

  const durationOptions = [
    { value: "30min", label: "30 minutes" },
    { value: "1hr", label: "1 hour" },
    { value: "endofday", label: "Until end of day" },
    { value: "tomorrow", label: "Until tomorrow" },
    { value: "custom", label: "Custom" },
  ];

  const calculateEndTime = (duration: string): Date => {
    const now = new Date();
    
    switch (duration) {
      case "30min":
        return new Date(now.getTime() + 30 * 60 * 1000);
      case "1hr":
        return new Date(now.getTime() + 60 * 60 * 1000);
      case "endofday":
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        return endOfDay;
      case "tomorrow":
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        return tomorrow;
      case "custom":
        if (customDate && customTime) {
          const [hours, minutes] = customTime.split(':').map(Number);
          const endTime = new Date(customDate);
          endTime.setHours(hours, minutes, 0, 0);
          return endTime;
        }
        return new Date(now.getTime() + 60 * 60 * 1000); // Default to 1 hour
      default:
        return new Date(now.getTime() + 60 * 60 * 1000);
    }
  };

  const handleSchedule = () => {
    const schedule: OfflineSchedule = {
      startTime: new Date(),
      endTime: calculateEndTime(selectedDuration),
      slackSync,
      teamsSync,
      slackMessage,
      teamsMessage,
      enableDND
    };
    
    onSchedule?.(schedule);
    onClose();
  };

  const endTime = calculateEndTime(selectedDuration);
  const previewText = `Your offline status will be active from now until ${format(endTime, "MMM dd, yyyy 'at' h:mm a")}.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            Set Offline Status
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            Let others know you're offline and configure automatic status updates.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Duration Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-text-primary">
              How long will you be offline?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDuration(option.value)}
                  className={cn(
                    "flex items-center justify-center px-3 py-2 rounded-md text-sm transition-colors",
                    selectedDuration === option.value
                      ? "bg-brand-300 text-white"
                      : "bg-brand-700 text-text-secondary hover:bg-brand-600"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            {selectedDuration === "custom" && (
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs text-text-secondary mb-2 block">
                      Until Date
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !customDate && "text-text-muted"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={customDate}
                          onSelect={setCustomDate}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs text-text-secondary mb-2 block">
                      Until Time
                    </Label>
                    <Input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Platform Sync Options */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-text-primary">
              Platform Sync
            </Label>
            
            <div className="space-y-4">
              {/* Slack */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={slackSync}
                      onCheckedChange={(checked) => setSlackSync(checked as boolean)}
                    />
                    <Label className="text-sm text-text-primary">
                      Update Slack status
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Slack
                  </Badge>
                </div>
                {slackSync && (
                  <Textarea
                    placeholder="Status message for Slack"
                    value={slackMessage}
                    onChange={(e) => setSlackMessage(e.target.value)}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>

              {/* Teams */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={teamsSync}
                      onCheckedChange={(checked) => setTeamsSync(checked as boolean)}
                    />
                    <Label className="text-sm text-text-primary">
                      Update Teams status
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Teams
                  </Badge>
                </div>
                {teamsSync && (
                  <Textarea
                    placeholder="Status message for Teams"
                    value={teamsMessage}
                    onChange={(e) => setTeamsMessage(e.target.value)}
                    className="text-sm"
                    rows={2}
                  />
                )}
              </div>

              {/* DND Option */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={enableDND}
                  onCheckedChange={(checked) => setEnableDND(checked as boolean)}
                />
                <Label className="text-sm text-text-primary">
                  Enable Do Not Disturb for same duration
                </Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-md bg-brand-700 border border-border-subtle">
            <p className="text-xs text-text-secondary leading-relaxed">
              {previewText}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSchedule} className="bg-gradient-to-r from-brand-200 to-brand-300">
              Go Offline
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}