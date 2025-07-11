import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomBrief {
  id: string;
  name: string;
  time: string;
  days: string[];
  enabled: boolean;
}

interface WeekendBrief {
  enabled: boolean;
  deliveryMethod: "email" | "audio" | "both";
  deliveryTime: string;
  weekendDays: string[];
  coveragePeriod: {
    startDay: string;
    startTime: string;
    endDay: string;
    endTime: string;
  };
}

const BriefConfigurationSection = () => {
  const { toast } = useToast();
  const { tags, updateSplitBriefSettings } = useIntegrationsState();
  
  const [scheduleType, setScheduleType] = useState<"auto" | "custom">("auto");
  const [days, setDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  const [times, setTimes] = useState({
    morning: { enabled: true, time: "08:00" },
    midday: { enabled: true, time: "12:30" },
    evening: { enabled: false, time: "18:00" }
  });

  const [customBriefs, setCustomBriefs] = useState<CustomBrief[]>([]);
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newCustomBrief, setNewCustomBrief] = useState({
    name: "",
    time: "20:00",
    days: [] as string[]
  });

  // Weekend brief state
  const [weekendBrief, setWeekendBrief] = useState<WeekendBrief>({
    enabled: false,
    deliveryMethod: "email",
    deliveryTime: "09:00",
    weekendDays: ["Monday"],
    coveragePeriod: {
      startDay: "Friday",
      startTime: "17:00",
      endDay: "Monday",
      endTime: "09:00"
    }
  });

  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const weekDayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your brief configuration has been updated successfully",
    });
  };

  // ... keep existing code (toggleDay, toggleTime, updateTimeValue functions)
  const toggleDay = (day: keyof typeof days) => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleTime = (time: keyof typeof times) => {
    setTimes(prev => ({ 
      ...prev, 
      [time]: { ...prev[time], enabled: !prev[time].enabled }
    }));
  };

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

  // Weekend brief functions
  const updateWeekendBrief = (updates: Partial<WeekendBrief>) => {
    setWeekendBrief(prev => ({ ...prev, ...updates }));
  };

  const toggleWeekendDay = (day: string) => {
    const updatedDays = weekendBrief.weekendDays.includes(day)
      ? weekendBrief.weekendDays.filter(d => d !== day)
      : [...weekendBrief.weekendDays, day];
    
    updateWeekendBrief({ weekendDays: updatedDays });
  };

  const hasMultipleTags = tags.length > 1;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Brief Configuration</h2>
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
          <h3 className="text-lg font-medium text-text-primary mb-4">Delivery Schedule</h3>
          <p className="text-sm text-text-secondary mb-6">
            Configure when and how you receive your briefs
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <RadioGroup 
            defaultValue="auto" 
            value={scheduleType}
            onValueChange={(value) => setScheduleType(value as "auto" | "custom")}
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
              <Label htmlFor="custom" className="text-text-primary">Set custom schedule</Label>
            </div>
          </RadioGroup>
          
          {scheduleType === "custom" && (
            <div className="mt-6 space-y-6">
              {/* ... keep existing code (Days and Default Brief Times sections) */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-text-primary mb-4 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Days
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(days).map(([day, isActive]) => (
                    <div key={day} className="flex items-center justify-between">
                      <Label htmlFor={`day-${day}`} className="text-text-primary capitalize">
                        {day}
                      </Label>
                      <Switch 
                        id={`day-${day}`}
                        checked={isActive}
                        onCheckedChange={() => toggleDay(day as keyof typeof days)}
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
                      onCheckedChange={() => toggleTime("morning")}
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
                      onCheckedChange={() => toggleTime("midday")}
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
                      onCheckedChange={() => toggleTime("evening")}
                    />
                  </div>
                </div>
              </div>

              {/* Weekend Brief Configuration */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-text-primary flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Weekend Brief
                  </h4>
                  <Switch 
                    checked={weekendBrief.enabled}
                    onCheckedChange={(checked) => updateWeekendBrief({ enabled: checked })}
                  />
                </div>
                <p className="text-xs text-text-secondary mb-4">
                  Get a summary covering your weekend period
                </p>

                {weekendBrief.enabled && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-text-secondary">Delivery Method</Label>
                        <Select value={weekendBrief.deliveryMethod} onValueChange={(value: "email" | "audio" | "both") => 
                          updateWeekendBrief({ deliveryMethod: value })
                        }>
                          <SelectTrigger className="bg-white/5 border-white/20 text-text-primary h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-text-secondary">Delivery Time</Label>
                        <Input
                          type="time"
                          value={weekendBrief.deliveryTime}
                          onChange={(e) => updateWeekendBrief({ deliveryTime: e.target.value })}
                          className="bg-white/5 border-white/20 text-text-primary h-8"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-text-secondary">Delivery Days</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["Monday", "Saturday", "Sunday"].map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant="outline"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              weekendBrief.weekendDays.includes(day)
                                ? 'bg-primary/20 text-primary border-primary/40'
                                : 'bg-white/5 text-text-secondary border-white/20'
                            }`}
                            onClick={() => toggleWeekendDay(day)}
                          >
                            {day.slice(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-text-secondary">Coverage Period</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
                        <div>
                          <Label className="text-xs text-text-secondary">From Day</Label>
                          <Select value={weekendBrief.coveragePeriod.startDay} onValueChange={(value) => 
                            updateWeekendBrief({ 
                              coveragePeriod: { ...weekendBrief.coveragePeriod, startDay: value }
                            })
                          }>
                            <SelectTrigger className="bg-white/5 border-white/20 text-text-primary h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_DAYS.map(day => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-text-secondary">From Time</Label>
                          <Input
                            type="time"
                            value={weekendBrief.coveragePeriod.startTime}
                            onChange={(e) => updateWeekendBrief({ 
                              coveragePeriod: { ...weekendBrief.coveragePeriod, startTime: e.target.value }
                            })}
                            className="bg-white/5 border-white/20 text-text-primary h-7 text-xs"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-text-secondary">To Day</Label>
                          <Select value={weekendBrief.coveragePeriod.endDay} onValueChange={(value) => 
                            updateWeekendBrief({ 
                              coveragePeriod: { ...weekendBrief.coveragePeriod, endDay: value }
                            })
                          }>
                            <SelectTrigger className="bg-white/5 border-white/20 text-text-primary h-7 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ALL_DAYS.map(day => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs text-text-secondary">To Time</Label>
                          <Input
                            type="time"
                            value={weekendBrief.coveragePeriod.endTime}
                            onChange={(e) => updateWeekendBrief({ 
                              coveragePeriod: { ...weekendBrief.coveragePeriod, endTime: e.target.value }
                            })}
                            className="bg-white/5 border-white/20 text-text-primary h-7 text-xs"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary mt-1">
                        Default: Friday 5:00 PM to Monday 9:00 AM
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Brief Schedules */}
              <div className="bg-white/5 rounded-lg border border-white/10 p-4">
                {/* ... keep existing code (custom brief schedules) */}
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

      {/* Split Brief Controls */}
      {hasMultipleTags && (
        <div>
          <SplitBriefControls
            tags={tags}
            onUpdateSettings={updateSplitBriefSettings}
          />
        </div>
      )}

      {!hasMultipleTags && (
        <div className="text-center py-8 text-text-secondary">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">Split Briefs</h3>
          <p className="text-sm">Connect multiple accounts to enable split brief configuration</p>
        </div>
      )}
    </div>
  );
};

export default BriefConfigurationSection;
