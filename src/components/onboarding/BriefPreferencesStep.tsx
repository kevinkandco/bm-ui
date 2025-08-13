import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Mail, Headphones, Clock, Sun, Coffee, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

interface BriefSchedule {
  id: string;
  name: string;
  deliveryMethod: "email" | "audio" | "both";
  scheduleTime: "morning" | "midday" | "evening" | "custom";
  briefTime: string;
  enabled: boolean;
  days: string[];
}

interface WeekendBrief {
  enabled: boolean;
  deliveryMethod: "email" | "audio" | "both";
  deliveryTime: string;
}

interface DailySchedule {
  workdayStart: string;
  workdayEnd: string;
}

interface BriefPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    briefSchedules?: BriefSchedule[];
    weekendBrief?: WeekendBrief;
    dailySchedule?: DailySchedule;
    [key: string]: any;
  };
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

const BriefPreferencesStep = ({ onNext, onBack, updateUserData, userData }: BriefPreferencesStepProps) => {
  // Initialize with single brief schedule
  const [brief, setBrief] = useState<BriefSchedule>(
    userData.briefSchedules?.[0] || {
      id: "default",
      name: "Daily Brief",
      deliveryMethod: "email",
      scheduleTime: "morning",
      briefTime: "08:00",
      enabled: true,
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    }
  );

  const [weekendBrief, setWeekendBrief] = useState<WeekendBrief>(
    userData.weekendBrief || {
      enabled: false,
      deliveryMethod: "email",
      deliveryTime: "09:00"
    }
  );

  const [workHours, setWorkHours] = useState<DailySchedule>(
    userData.dailySchedule || {
      workdayStart: "09:00",
      workdayEnd: "17:00"
    }
  );

  const [showWorkHours, setShowWorkHours] = useState(false);

  const updateBrief = (updates: Partial<BriefSchedule>) => {
    setBrief(prev => ({ ...prev, ...updates }));
  };

  const handleMethodChange = (method: "email" | "audio" | "both") => {
    updateBrief({ deliveryMethod: method });
  };
  
  const handleScheduleChange = (schedule: "morning" | "midday" | "evening" | "custom") => {
    const updates: Partial<BriefSchedule> = { scheduleTime: schedule };
    
    if (schedule === "morning") {
      updates.briefTime = "08:00";
    } else if (schedule === "midday") {
      updates.briefTime = "12:00";
    } else if (schedule === "evening") {
      updates.briefTime = "17:00";
    }
    
    updateBrief(updates);
  };

  const toggleDay = (dayShort: string) => {
    const dayMap: Record<string, string> = {
      "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", 
      "Thu": "Thursday", "Fri": "Friday"
    };
    const fullDay = dayMap[dayShort];
    
    const updatedDays = brief.days.includes(fullDay)
      ? brief.days.filter(d => d !== fullDay)
      : [...brief.days, fullDay];
    
    updateBrief({ days: updatedDays });
  };

  const handleContinue = () => {
    updateUserData({ 
      briefSchedules: [brief],
      weekendBrief,
      dailySchedule: workHours
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={9} totalSteps={10} />
      
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Clock className="h-6 w-6 text-accent-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-text-primary tracking-tighter">Customize your briefs</h2>
          <p className="text-text-secondary">
            Set up your daily brief schedule, which includes delivery method, schedule, time, and days of the week.
          </p>
        </div>
      </div>
      
      {/* Daily Brief Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text-primary">Your Brief Schedule</h3>
        <div className="border border-border-subtle rounded-lg p-4 space-y-4 bg-brand-600/20">
          
          {/* Delivery Method */}
          <div className="space-y-2">
            <Label className="text-text-primary text-sm">Delivery method</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { method: "email" as const, icon: Mail, label: "Email" },
                { method: "audio" as const, icon: Headphones, label: "Audio" },
                { method: "both" as const, icon: Mail, label: "Both" }
              ].map(({ method, icon: Icon, label }) => (
                <button
                  key={method}
                  onClick={() => handleMethodChange(method)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all text-xs",
                    brief.deliveryMethod === method
                      ? 'border-brand-300 bg-brand-500/20 text-brand-300'
                      : 'border-border-subtle bg-brand-700/30 text-text-secondary hover:bg-brand-600/30'
                  )}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Time */}
          <div className="space-y-3">
            <Label className="text-text-primary text-sm">Schedule</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { time: "morning" as const, icon: Sun, label: "Morning", value: "8AM" },
                { time: "midday" as const, icon: Coffee, label: "Midday", value: "12PM" },
                { time: "evening" as const, icon: Moon, label: "Evening", value: "5PM" },
                { time: "custom" as const, icon: Clock, label: "Custom", value: "" }
              ].map(({ time, icon: Icon, label, value }) => (
                <button
                  key={time}
                  onClick={() => handleScheduleChange(time)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-xs",
                    brief.scheduleTime === time
                      ? 'border-brand-300 bg-brand-500/20 text-brand-300'
                      : 'border-border-subtle bg-brand-700/30 text-text-secondary hover:bg-brand-600/30'
                  )}
                >
                  <Icon size={14} />
                  <span className="font-medium">{label}</span>
                  {value && <span className="text-xs opacity-60">{value}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Time and Days in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text-primary text-sm">Time</Label>
              <Input
                type="time"
                value={brief.briefTime}
                onChange={(e) => updateBrief({ briefTime: e.target.value, scheduleTime: "custom" })}
                className="bg-brand-700/30 border-border-subtle text-text-primary h-12 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-text-primary text-sm">Days</Label>
              <div className="flex gap-1">
                {WEEKDAYS.map(day => {
                  const isSelected = brief.days.includes({
                    "Mon": "Monday", "Tue": "Tuesday", "Wed": "Wednesday", 
                    "Thu": "Thursday", "Fri": "Friday"
                  }[day]);
                  
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium transition-colors flex-1",
                        isSelected
                          ? "bg-brand-300 text-brand-900 border-brand-300"
                          : "bg-brand-700/30 text-text-secondary border border-border-subtle hover:bg-brand-600/30"
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekend Brief */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-lg bg-brand-600/20 border border-border-subtle">
          <div>
            <h4 className="font-medium text-text-primary text-sm">Weekend Brief</h4>
            <p className="text-xs text-text-secondary">Get a Monday morning summary</p>
          </div>
          <Switch 
            checked={weekendBrief.enabled}
            onCheckedChange={(checked) => setWeekendBrief(prev => ({ ...prev, enabled: checked }))}
          />
        </div>

        {weekendBrief.enabled && (
          <div className="pl-4 space-y-2 border-l-2 border-accent-primary/20">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-text-primary text-xs">Method</Label>
                <select
                  value={weekendBrief.deliveryMethod}
                  onChange={(e) => setWeekendBrief(prev => ({ 
                    ...prev, 
                    deliveryMethod: e.target.value as "email" | "audio" | "both" 
                  }))}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-brand-700/30 border border-border-subtle text-text-primary"
                >
                  <option value="email">Email</option>
                  <option value="audio">Audio</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-text-primary text-xs">Time</Label>
                <Input
                  type="time"
                  value={weekendBrief.deliveryTime}
                  onChange={(e) => setWeekendBrief(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="bg-brand-700/30 border-border-subtle text-text-primary h-9 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Optional Work Hours */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-text-primary text-sm">Work Hours (Optional)</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWorkHours(!showWorkHours)}
            className="text-xs text-text-secondary"
          >
            {showWorkHours ? "Hide" : "Set"}
          </Button>
        </div>

        {showWorkHours && (
          <div className="p-4 rounded-lg bg-brand-600/20 border border-border-subtle">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-text-primary text-xs">Start</Label>
                <Input
                  type="time"
                  value={workHours.workdayStart}
                  onChange={(e) => setWorkHours(prev => ({ ...prev, workdayStart: e.target.value }))}
                  className="bg-brand-700/30 border-border-subtle text-text-primary h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-text-primary text-xs">End</Label>
                <Input
                  type="time"
                  value={workHours.workdayEnd}
                  onChange={(e) => setWorkHours(prev => ({ ...prev, workdayEnd: e.target.value }))}
                  className="bg-brand-700/30 border-border-subtle text-text-primary h-10 text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="back"
          size="none"
          onClick={onBack}
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="pill"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BriefPreferencesStep;