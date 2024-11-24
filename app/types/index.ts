export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  recurring_days: string[] | null;
}

export type EventType = 'weekly' | 'special';

export interface FormData {
  // ... form data interface
}
