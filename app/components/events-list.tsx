'use client';

import { supabase } from '@/lib/supabase';
import { format, isAfter, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';

type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type Event = {
  id: string;
  title: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  description: string;
  is_recurring: boolean;
  recurring_days: DayOfWeek[] | null;
};

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // Get all events
      const { data: allEvents, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      if (!allEvents) {
        setEvents([]);
        setLoading(false);
        return;
      }

      // Filter and process events
      const today = startOfToday();
      const processedEvents = allEvents.filter((event) => {
        // For one-time events, check if the date is in the future
        if (!event.is_recurring && event.event_date) {
          const eventDate = new Date(event.event_date);
          return (
            isAfter(eventDate, today) ||
            event.event_date === format(today, 'yyyy-MM-dd')
          );
        }
        // Keep all recurring events
        return event.is_recurring;
      });

      setEvents(processedEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error loading events:', error);
      setLoading(false);
    }
  };

  const formatEventTime = (event: Event) => {
    if (!event.start_time) return '';

    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      return format(date, 'h:mm a');
    };

    const start = formatTime(event.start_time);
    const end = event.end_time ? formatTime(event.end_time) : '';

    return end ? `${start} - ${end}` : start;
  };

  const formatEventDate = (event: Event) => {
    if (event.is_recurring && event.recurring_days) {
      const days = event.recurring_days.map(
        (day) => day.charAt(0).toUpperCase() + day.slice(1)
      );

      // If there are more than 3 days, show a more compact format
      if (days.length > 3) {
        // Find consecutive days
        const ranges = [];
        let start = 0;
        const daysOrder = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        const sortedDays = days.sort(
          (a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b)
        );

        for (let i = 0; i < sortedDays.length; i++) {
          if (
            i === sortedDays.length - 1 ||
            daysOrder.indexOf(sortedDays[i + 1]) !==
              daysOrder.indexOf(sortedDays[i]) + 1
          ) {
            if (start === i) {
              ranges.push(sortedDays[i].slice(0, 3));
            } else {
              ranges.push(
                `${sortedDays[start].slice(0, 3)}-${sortedDays[i].slice(0, 3)}`
              );
            }
            start = i + 1;
          }
        }
        return ranges.join(', ');
      }

      // For 3 or fewer days, just show the abbreviated days
      return days.map((day) => day.slice(0, 3)).join(', ');
    }

    if (event.event_date) {
      const date = new Date(event.event_date);
      return format(date, 'MMM d').toUpperCase();
    }

    return '';
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  // Separate recurring and one-time events
  const recurringEvents = events.filter((event) => event.is_recurring);
  const oneTimeEvents = events.filter((event) => !event.is_recurring);

  const EventCard = ({ event }: { event: Event }) => (
    <div className="relative rounded-xl bg-black/40 backdrop-blur-sm border-2 border-[#E4A853]/20 p-8 transform transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
        <div className="bg-[#E4A853] text-black font-bold px-6 py-2 rounded-full whitespace-nowrap">
          {formatEventDate(event)}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-playfair text-2xl font-bold text-white mb-2">
          {event.title}
        </h3>

        <div className="text-[#E4A853] font-medium mb-4">
          {formatEventTime(event)}
        </div>

        <p className="text-gray-300">{event.description}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-20">
      {/* Weekly Events Section */}
      {recurringEvents.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#E4A853]"></div>
              <div className="w-2 h-2 rotate-45 bg-[#E4A853]"></div>
              <div className="w-12 h-px bg-[#E4A853]"></div>
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-white">
              Weekly Events
            </h3>
            <p className="font-cormorant text-xl text-gray-300 mt-2">
              Join us for our regular weekly entertainment
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recurringEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* One-time Events Section */}
      {oneTimeEvents.length > 0 && (
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-px bg-[#E4A853]"></div>
              <div className="w-2 h-2 rotate-45 bg-[#E4A853]"></div>
              <div className="w-12 h-px bg-[#E4A853]"></div>
            </div>
            <h3 className="font-playfair text-3xl md:text-4xl font-bold text-white">
              Upcoming Special Events
            </h3>
            <p className="font-cormorant text-xl text-gray-300 mt-2">
              Don&apos;t miss these special occasions
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {oneTimeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )}

      {/* Show message if no events */}
      {events.length === 0 && (
        <div className="text-center text-gray-300 font-cormorant text-xl">
          No upcoming events scheduled. Check back soon!
        </div>
      )}
    </div>
  );
}
