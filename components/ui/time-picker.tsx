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
}

export function TimePicker({ date, setDate, label }: TimePickerProps) {
  // Create arrays for hours (12-hour format) and minutes
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  // Get current values
  const hour = date ? date.getHours() % 12 || 12 : undefined;
  const minute = date ? date.getMinutes() : undefined;
  const period = date ? (date.getHours() >= 12 ? 'PM' : 'AM') : undefined;

  // Handle time updates
  const updateTime = (
    newHour?: number,
    newMinute?: number,
    newPeriod?: string
  ) => {
    if (!newHour && !newMinute && !newPeriod) return;

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
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-[#2C5530]">{label}</Label>}
      <div className="flex gap-2">
        {/* Hours */}
        <Select
          value={hour?.toString()}
          onValueChange={(value) =>
            updateTime(parseInt(value), undefined, undefined)
          }
        >
          <SelectTrigger className="w-[110px] border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
            <SelectValue placeholder="Hour" className="text-[#2C5530]" />
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
        >
          <SelectTrigger className="w-[110px] border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
            <SelectValue placeholder="Min" className="text-[#2C5530]" />
          </SelectTrigger>
          <SelectContent>
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
        >
          <SelectTrigger className="w-[110px] border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]">
            <SelectValue placeholder="AM/PM" className="text-[#2C5530]" />
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
    </div>
  );
}
