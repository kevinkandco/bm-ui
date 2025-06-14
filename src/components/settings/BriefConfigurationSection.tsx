
import React, { useCallback, useEffect, useState } from "react";
import { Clock, Mail, Volume2, Calendar, Bell, Save, Plus, Trash2, Edit2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SplitBriefControls from "./SplitBriefControls";
import { useIntegrationsState } from "./useIntegrationsState";
import { useApi } from "@/hooks/useApi";
import { getTimePeriod } from "@/lib/utils";
import moment from "moment";
import FancyLoader from "./modal/FancyLoader";

interface CustomBrief {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

const BriefConfigurationSection = () => {
  const { toast } = useToast();
  const { tags, updateSplitBriefSettings, loading } = useIntegrationsState();
  const { call } = useApi();
  
  const [scheduleType, setScheduleType] = useState<"auto" | "custom">("auto");
  const [days, setDays] = useState({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });
  const [times, setTimes] = useState({
    morning: { enabled: true, time: "08:00" },
    midday: { enabled: true, time: "12:30" },
    evening: { enabled: false, time: "18:00" }
  });
  // const [time, setTime] = useState({
  //   morning: "08:00 AM",
  //   midday: "12:00 PM",
  //   evening: "5:00 PM"
  // });

  const getData = useCallback(async () => {
    const response = await call('get', "/api/settings/brief-configuration/days", {
      showToast: true,
      toastTitle: "Failed to get data",
      toastDescription: "Failed to get data",
      returnOnFailure: false,
      toastVariant: "destructive"
    });

    if (response) {
      setDays(response?.data?.brief_days);

      const briefTime = response?.data?.brief_time; // e.g., "08:00"
      const timeFlags = getTimePeriod(briefTime);   // { morning: true, midday: false, evening: false }

      setTimes(prevTimes => {
        const updatedTimes = {
          morning: { ...prevTimes.morning, enabled: timeFlags.morning },
          midday: { ...prevTimes.midday, enabled: timeFlags.midday },
          evening: { ...prevTimes.evening, enabled: timeFlags.evening },
        };

        const activeKey = Object.keys(timeFlags).find(
          key => timeFlags[key as keyof typeof timeFlags]
        );

        if (activeKey) {
          updatedTimes[activeKey as keyof typeof updatedTimes].time = briefTime;
        }

        return updatedTimes;
      });
    }
  }, [call]);



  useEffect(() => {
    getData();
  }, [getData])

  const [customBriefs, setCustomBriefs] = useState<CustomBrief[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomBrief, setNewCustomBrief] = useState({
    name: "",
    time: "20:00",
    days: [] as string[]
  });

  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const weekDayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your brief configuration has been updated successfully",
    });
  };

  const toggleDay = async (day: keyof typeof days) => {
    const updatedDays = { ...days, [day]: !days[day] };
    const response = await call('post' ,"/api/settings/brief-configuration/days", {
      body: updatedDays,
      showToast: true,
      toastTitle: "Failed to update data",
      toastDescription: "Failed to update data",
      returnOnFailure: false,
      toastVariant: "destructive"
    });
    if (response) setDays(updatedDays);
  };

  const toggleTime = async (time: string, briefTimeKey: keyof typeof times) => {
    const formattedTime = moment(time, "h:mm A").format("HH:mm");

    const response = await call('post', "/api/settings/brief-configuration/days", {
      body: { ...days, briefTime: formattedTime },
      showToast: true,
      toastTitle: "Failed to update data",
      toastDescription: "Failed to update data",
      returnOnFailure: false,
      toastVariant: "destructive"
    });

    if (response) {
      const briefTime = response?.data?.brief_time; // e.g., "08:00"
      const timeFlags = getTimePeriod(briefTime);   // { morning: true, midday: false, evening: false }

      setTimes(prev => {
        return {
          morning: { ...prev.morning, enabled: timeFlags.morning },
          midday: { ...prev.midday, enabled: timeFlags.midday },
          evening: { ...prev.evening, enabled: timeFlags.evening }
        };
      });

      const formattedDisplayTime = moment(briefTime, "HH:mm").format("h:mm A");
      const activeKey = Object.keys(timeFlags).find(key => timeFlags[key as keyof typeof timeFlags]);

      if (activeKey) {
        setTimes(prev => ({
          ...prev,
          [activeKey]: formattedDisplayTime
        }));
      }
    }
  };


  // const toggleTime = (time: keyof typeof times) => {
  //   setTimes(prev => ({ 
  //     ...prev, 
  //     [time]: { ...prev[time], enabled: !prev[time].enabled }
  //   }));
  // };

  const updateTimeValue = (timeKey: keyof typeof times, newTime: string) => {
    setTimes(prev => ({
      ...prev,
      [timeKey]: { ...prev[timeKey], time: newTime }
    }));
  };

  const addCustomBrief = () => {
    if (!newCustomBrief.name.trim()) return;
    
    const customBrief: CustomBrief = {
      id: Date.now().toString(),
      name: newCustomBrief.name,
      time: newCustomBrief.time,
      days: newCustomBrief.days,
      enabled: true
    };
    
    setCustomBriefs(prev => [...prev, customBrief]);
    setNewCustomBrief({ name: "", time: "20:00", days: [] });
    setIsAddingCustom(false);
  };

  const removeCustomBrief = (id: string) => {
    setCustomBriefs(prev => prev.filter(brief => brief.id !== id));
  };

  const toggleCustomBrief = (id: string) => {
    setCustomBriefs(prev => prev.map(brief => 
      brief.id === id ? { ...brief, enabled: !brief.enabled } : brief
    ));
  };

  const toggleCustomBriefDay = (briefId: string, day: string) => {
    setCustomBriefs(prev => prev.map(brief => {
      if (brief.id === briefId) {
        const days = brief.days.includes(day) 
          ? brief.days.filter(d => d !== day)
          : [...brief.days, day];
        return { ...brief, days };
      }
      return brief;
    }));
  };

  const toggleNewCustomDay = (day: string) => {
    setNewCustomBrief(prev => ({
      ...prev,
      days: prev.days.includes(day) 
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  // const hasMultipleTags = tags.length > 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Brief Configuration
        </h2>
        <Button
          onClick={handleSaveSettings}
          className="shadow-subtle hover:shadow-glow transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      {/* Delivery Schedule Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-4">
            Delivery Schedule
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            Configure when and how you receive your briefs
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <RadioGroup
            defaultValue="auto"
            value={scheduleType}
            onValueChange={(value) =>
              setScheduleType(value as "auto" | "custom")
            }
            className="space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="auto" id="auto" />
                <Label htmlFor="auto" className="text-text-primary">Use AI-recommended schedule</Label>
              </div>
              <p className="text-sm text-text-secondary ml-7">
                AI Recommended quietly notices when you're tied up—back-to-back meetings, offline stretches, deep-work blocks—and automatically serves a concise, privacy-safe catch-up on what you missed, so you can jump back in without the scroll.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-text-primary">
                Set custom schedule
              </Label>
            </div>
          </RadioGroup>

          {scheduleType === "custom" && (
            <div className="mt-6 space-y-6">
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Days
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(days).map(([day, isActive]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <Label
                        htmlFor={`day-${day}`}
                        className="text-text-primary capitalize"
                      >
                        {day}
                      </Label>
                      <Switch
                        id={`day-${day}`}
                        checked={isActive}
                        onCheckedChange={() =>
                          toggleDay(day as keyof typeof days)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Default Brief Times
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <Label htmlFor="time-morning" className="text-text-primary">Morning Brief</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="time"
                            value={times.morning.time}
                            onChange={(e) => updateTimeValue("morning", e.target.value)}
                            className="w-24 h-7 text-xs bg-white/5 border-white/20"
                          />
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="time-morning"
                      checked={times.morning.enabled}
                      onCheckedChange={() => toggleTime(times.morning.time ,"morning")}
                    />
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <Label htmlFor="time-midday" className="text-text-primary">Midday Brief</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="time"
                            value={times.midday.time}
                            onChange={(e) => updateTimeValue("midday", e.target.value)}
                            className="w-24 h-7 text-xs bg-white/5 border-white/20"
                          />
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="time-midday"
                      checked={times.midday.enabled}
                      onCheckedChange={() => toggleTime(times.midday.time, "midday")}
                    />
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <Label htmlFor="time-evening" className="text-text-primary">Evening Brief</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="time"
                            value={times.evening.time}
                            onChange={(e) => updateTimeValue("evening", e.target.value)}
                            className="w-24 h-7 text-xs bg-white/5 border-white/20"
                          />
                        </div>
                      </div>
                    </div>
                    <Switch
                      id="time-evening"
                      checked={times.evening.enabled}
                      onCheckedChange={() => toggleTime(times.evening.time, "evening")}
                    />
                  </div>
                </div>
              </div>

              {/* Custom Brief Schedules */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-text-primary flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Custom Brief Schedules
                  </h4>
                  <Button
                    onClick={() => setIsAddingCustom(true)}
                    size="sm"
                    variant="outline"
                    className="h-7 px-3 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Custom
                  </Button>
                </div>

                {/* Add new custom brief form */}
                {isAddingCustom && (
                  <div className="mb-4 p-3 bg-white/5 rounded border border-white/20">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-text-secondary">Brief Name</Label>
                        <Input
                          placeholder="e.g. Post-dinner brief"
                          value={newCustomBrief.name}
                          onChange={(e) => setNewCustomBrief(prev => ({ ...prev, name: e.target.value }))}
                          className="h-7 text-xs bg-white/5 border-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-text-secondary">Time</Label>
                        <Input
                          type="time"
                          value={newCustomBrief.time}
                          onChange={(e) => setNewCustomBrief(prev => ({ ...prev, time: e.target.value }))}
                          className="w-24 h-7 text-xs bg-white/5 border-white/20"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-text-secondary">Days</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {weekDayLabels.map((day, index) => (
                            <Button
                              key={day}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-6 px-2 text-xs ${
                                newCustomBrief.days.includes(weekDays[index])
                                  ? 'bg-primary/20 text-primary border-primary/40'
                                  : 'bg-white/5 text-text-secondary border-white/20'
                              }`}
                              onClick={() => toggleNewCustomDay(weekDays[index])}
                            >
                              {day.slice(0, 3)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={addCustomBrief} size="sm" className="h-7 px-3 text-xs">
                          Add
                        </Button>
                        <Button 
                          onClick={() => setIsAddingCustom(false)} 
                          variant="outline" 
                          size="sm" 
                          className="h-7 px-3 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Custom briefs list */}
                <div className="space-y-3">
                  {customBriefs.map((brief) => (
                    <div key={brief.id} className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/20">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-text-primary">{brief.name}</span>
                          <Badge variant="secondary" className="text-xs h-4 px-2">
                            {brief.time}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {weekDayLabels.map((day, index) => (
                            <Button
                              key={day}
                              type="button"
                              variant="outline"
                              size="sm"
                              className={`h-5 px-1.5 text-xs ${
                                brief.days.includes(weekDays[index])
                                  ? 'bg-primary/20 text-primary border-primary/40'
                                  : 'bg-white/5 text-text-secondary border-white/20 opacity-50'
                              }`}
                              onClick={() => toggleCustomBriefDay(brief.id, weekDays[index])}
                            >
                              {day.slice(0, 1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={brief.enabled}
                          onCheckedChange={() => toggleCustomBrief(brief.id)}
                        />
                        <Button
                          onClick={() => removeCustomBrief(brief.id)}
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-text-secondary hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {customBriefs.length === 0 && !isAddingCustom && (
                    <p className="text-xs text-text-secondary text-center py-3">
                      No custom brief schedules configured
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-border-subtle" />

      {loading ? (
        <FancyLoader />
      ) : (
        <>
          {/* Split Brief Controls */}
          {!loading && tags?.length > 0 && (
            <div>
              <SplitBriefControls
                tags={tags}
                onUpdateSettings={updateSplitBriefSettings}
              />
            </div>
          )}

          {!(tags?.length > 0) && (
            <div className="text-center py-8 text-text-secondary">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Split Briefs
              </h3>
              <p className="text-sm">
                Connect multiple accounts to enable split brief configuration
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BriefConfigurationSection;
