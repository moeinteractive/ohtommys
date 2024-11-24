'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import * as React from 'react';

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function TimePicker({
  date,
  setDate,
  label,
  disabled = false,
  error,
  className,
}: TimePickerProps) {
  // Create arrays for hours (12-hour format) and minutes
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  // Get current values
  const hour = date ? date.getHours() % 12 || 12 : undefined;
  const minute = date ? date.getMinutes() : undefined;
  const period = date ? (date.getHours() >= 12 ? 'PM' : 'AM') : undefined;

  // Handle time updates
  const updateTime = React.useCallback(
    (newHour?: number, newMinute?: number, newPeriod?: string) => {
      if (disabled) return;
      if (!newHour && !newMinute && !newPeriod) return;

      try {
        const currentDate = date || new Date();
        const currentHour = newHour || hour || 12;
        const currentMinute = newMinute ?? minute ?? 0;
        const currentPeriod = newPeriod || period || 'AM';

        let hours24 = currentHour;
        if (currentPeriod === 'PM' && currentHour !== 12) hours24 += 12;
        if (currentPeriod === 'AM' && currentHour === 12) hours24 = 0;

        const newDate = new Date(currentDate);
        newDate.setHours(hours24);
        newDate.setMinutes(currentMinute);
        setDate(newDate);
      } catch (err) {
        console.error('Error updating time:', err);
      }
    },
    [date, setDate, hour, minute, period, disabled]
  );

  const selectClasses = cn(
    'w-[110px]',
    'border-[#2C5530]',
    'focus:ring-[#E4A853]',
    'text-[#2C5530]',
    disabled && 'opacity-50 cursor-not-allowed',
    error && 'border-red-500',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn('text-[#2C5530]', error && 'text-red-500')}>
          {label}
        </Label>
      )}
      <div className="flex gap-2">
        {/* Hours */}
        <Select
          value={hour?.toString()}
          onValueChange={(value) =>
            updateTime(parseInt(value), undefined, undefined)
          }
          disabled={disabled}
        >
          <SelectTrigger className={selectClasses}>
            <Clock className="h-4 w-4 mr-2 opacity-50" />
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((h) => (
              <SelectItem
                key={h}
                value={h.toString()}
                className="text-[#2C5530] hover:bg-[#2C5530]/5 cursor-pointer"
              >
                {h.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Minutes */}
        <Select
          value={minute?.toString()}
          onValueChange={(value) =>
            updateTime(undefined, parseInt(value), undefined)
          }
          disabled={disabled}
        >
          <SelectTrigger className={selectClasses}>
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent className="select-content">
            {minutes.map((m) => (
              <SelectItem
                key={m}
                value={m.toString()}
                className="text-[#2C5530] hover:bg-[#2C5530]/5 cursor-pointer"
              >
                {m.toString().padStart(2, '0')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* AM/PM */}
        <Select
          value={period}
          onValueChange={(value) => updateTime(undefined, undefined, value)}
          disabled={disabled}
        >
          <SelectTrigger className={selectClasses}>
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem
                key={p}
                value={p}
                className="text-[#2C5530] hover:bg-[#2C5530]/5 cursor-pointer"
              >
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}
