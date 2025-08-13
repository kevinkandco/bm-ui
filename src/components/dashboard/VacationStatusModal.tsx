import React, { useState, useEffect } from 'react';
import { format, isAfter, isBefore } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface VacationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vacationSchedule: VacationSchedule) => void;
  currentVacation?: VacationSchedule | null;
}

export interface VacationSchedule {
  id: string;
  startDate: Date;
  endDate: Date;
  isAllDayStart: boolean;
  isAllDayEnd: boolean;
  deliverCatchUpBrief: boolean;
  isActive: boolean;
}

const VacationStatusModal = ({ isOpen, onClose, onSave, currentVacation }: VacationStatusModalProps) => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // Default 7 days from now
  const [isAllDayStart, setIsAllDayStart] = useState(true);
  const [isAllDayEnd, setIsAllDayEnd] = useState(true);
  const [deliverCatchUpBrief, setDeliverCatchUpBrief] = useState(true);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && !currentVacation) {
      const now = new Date();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setStartDate(now);
      setEndDate(nextWeek);
      setIsAllDayStart(true);
      setIsAllDayEnd(true);
      setDeliverCatchUpBrief(true);
      setStartTime('00:00');
      setEndTime('23:59');
    }
  }, [isOpen, currentVacation]);

  const formatPreviewDateTime = (date: Date, isAllDay: boolean, time: string) => {
    if (isAllDay) {
      return format(date, 'MMM d, yyyy');
    }
    const [hours, minutes] = time.split(':');
    const dateWithTime = new Date(date);
    dateWithTime.setHours(parseInt(hours), parseInt(minutes));
    return format(dateWithTime, 'MMM d, yyyy \'at\' h:mm a');
  };

  const createVacationDateTime = (date: Date, isAllDay: boolean, time: string, isEnd: boolean = false) => {
    const result = new Date(date);
    if (isAllDay) {
      if (isEnd) {
        result.setHours(23, 59, 59, 999);
      } else {
        result.setHours(0, 0, 0, 0);
      }
    } else {
      const [hours, minutes] = time.split(':');
      result.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    return result;
  };

  const handleSave = () => {
    const actualStartDate = createVacationDateTime(startDate, isAllDayStart, startTime);
    const actualEndDate = createVacationDateTime(endDate, isAllDayEnd, endTime, true);

    if (isAfter(actualStartDate, actualEndDate)) {
      return; // Invalid date range
    }

    const vacationSchedule: VacationSchedule = {
      id: currentVacation?.id || Date.now().toString(),
      startDate: actualStartDate,
      endDate: actualEndDate,
      isAllDayStart,
      isAllDayEnd,
      deliverCatchUpBrief,
      isActive: false // Will be set to true when the start time is reached
    };

    onSave(vacationSchedule);
    onClose();
  };

  const isStartDatePickerOpen = useState(false);
  const isEndDatePickerOpen = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-text-primary">
            Set Vacation Status
          </DialogTitle>
          <DialogDescription className="text-sm text-text-secondary">
            Pause your Brief Me summaries while you're away. We'll automatically resume when you return.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Start Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-text-primary">Start Date</Label>
            <div className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-text-secondary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    disabled={(date) => isBefore(date, new Date())}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="all-day-start"
                  checked={isAllDayStart}
                  onCheckedChange={setIsAllDayStart}
                />
                <Label htmlFor="all-day-start" className="text-sm">All-day</Label>
              </div>

              {!isAllDayStart && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-3 py-2 text-sm border border-border-subtle rounded-md bg-transparent text-text-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-text-primary">End Date</Label>
            <div className="space-y-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-text-secondary"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    disabled={(date) => isBefore(date, startDate)}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="all-day-end"
                  checked={isAllDayEnd}
                  onCheckedChange={setIsAllDayEnd}
                />
                <Label htmlFor="all-day-end" className="text-sm">All-day</Label>
              </div>

              {!isAllDayEnd && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-text-secondary" />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-3 py-2 text-sm border border-border-subtle rounded-md bg-transparent text-text-primary"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Catch-up Brief Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="catch-up-brief"
              checked={deliverCatchUpBrief}
              onCheckedChange={setDeliverCatchUpBrief}
            />
            <Label htmlFor="catch-up-brief" className="text-sm">
              Deliver a catch-up brief when I return
            </Label>
          </div>

          {/* Preview */}
          <div className="p-3 bg-surface/50 rounded-lg border border-border-subtle">
            <p className="text-sm text-text-secondary">
              Your vacation status will be active from{' '}
              <span className="font-medium text-text-primary">
                {formatPreviewDateTime(startDate, isAllDayStart, startTime)}
              </span>
              {' '}to{' '}
              <span className="font-medium text-text-primary">
                {formatPreviewDateTime(endDate, isAllDayEnd, endTime)}
              </span>
              .
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!startDate || !endDate || isAfter(createVacationDateTime(startDate, isAllDayStart, startTime), createVacationDateTime(endDate, isAllDayEnd, endTime, true))}
            >
              Save & Set Vacation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VacationStatusModal;