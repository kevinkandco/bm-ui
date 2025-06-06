
import React, { useState } from "react";
import { Clock, Mail, Volume2, Calendar, Bell, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SplitBriefControls from "./SplitBriefControls";
import { useIntegrationsState } from "./useIntegrationsState";

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
    morning: true,
    midday: true,
    evening: false
  });

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your brief configuration has been updated successfully",
    });
  };

  const toggleDay = (day: keyof typeof days) => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleTime = (time: keyof typeof times) => {
    setTimes(prev => ({ ...prev, [time]: !prev[time] }));
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
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="text-text-primary">Use AI-recommended schedule</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-text-primary">Set custom schedule</Label>
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
                  Times
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-morning" className="text-text-primary">Morning Brief</Label>
                      <p className="text-xs text-text-secondary">Delivered at 8:00 AM</p>
                    </div>
                    <Switch 
                      id="time-morning"
                      checked={times.morning}
                      onCheckedChange={() => toggleTime("morning")}
                    />
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-midday" className="text-text-primary">Midday Brief</Label>
                      <p className="text-xs text-text-secondary">Delivered at 12:30 PM</p>
                    </div>
                    <Switch 
                      id="time-midday"
                      checked={times.midday}
                      onCheckedChange={() => toggleTime("midday")}
                    />
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-evening" className="text-text-primary">Evening Brief</Label>
                      <p className="text-xs text-text-secondary">Delivered at 6:00 PM</p>
                    </div>
                    <Switch 
                      id="time-evening"
                      checked={times.evening}
                      onCheckedChange={() => toggleTime("evening")}
                    />
                  </div>
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
