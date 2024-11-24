import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Utility functions to get business hours and current day
export const getTodayHours = () => {
  const today = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.

  switch (today) {
    case 0: // Sunday
      return '12:00 PM - 8:00 PM';
    case 1:
    // Monday
    case 2: // Tuesday
      return 'Closed';
    case 3:
    // Wednesday
    case 4:
    // Thursday
    case 6: // Saturday
      return '11:00 AM - 11:00 PM';
    case 5: // Friday
      return '11:00 AM - 12:00 AM';
    default:
      return '11:00 AM - 11:00 PM';
  }
};

export const getDayName = () => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[new Date().getDay()];
};
