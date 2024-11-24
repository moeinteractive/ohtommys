'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import * as React from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  recurring_days: string[] | null;
}

interface EventsContentProps {
  type: 'weekly' | 'special';
}

export function EventsContent({ type }: EventsContentProps) {
  const [allEvents, setAllEvents] = React.useState<Event[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: eventData, error } = await fetch('/api/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        }).then((res) => res.json());

        if (error) {
          console.error('Error loading events:', error);
          return;
        }

        if (eventData) {
          setAllEvents(eventData);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const displayEvents = allEvents.filter((event) =>
    type === 'weekly' ? event.is_recurring : !event.is_recurring
  );

  if (isLoading) {
    return (
      <div className="grid gap-6 mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg
                     h-[300px] animate-pulse"
          >
            <div className="bg-[#E4A853]/20 w-24 h-6 rounded-md mb-4 mx-auto" />
            <div className="bg-[#F5E6D3]/20 w-3/4 h-8 rounded-md mb-4 mx-auto" />
            <div className="bg-[#F5E6D3]/20 w-1/2 h-6 rounded-md mb-4 mx-auto" />
            <div className="bg-[#F5E6D3]/20 w-5/6 h-20 rounded-md mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mx-auto max-w-6xl">
      {displayEvents.length === 4 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {displayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg
                       flex flex-col items-center text-center transition-all duration-300 
                       hover:bg-black/30 hover:border-[#F5E6D3]/20 hover:shadow-lg 
                       hover:shadow-[#E4A853]/5"
            >
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {event.is_recurring ? (
                  event.recurring_days?.map((day: string) => (
                    <div
                      key={day}
                      className="bg-[#E4A853]/20 text-[#E4A853] px-3 py-1 rounded-md text-xs font-medium tracking-wider uppercase"
                    >
                      {day}
                    </div>
                  ))
                ) : (
                  <div className="bg-[#E4A853]/20 text-[#E4A853] px-3 py-1 rounded-md text-sm">
                    {format(new Date(event.event_date!), 'MMM dd')}
                  </div>
                )}
              </div>
              <h3 className="text-2xl sm:text-xl lg:text-2xl font-playfair text-[#F5E6D3] mb-3">
                {event.title}
              </h3>
              <p className="text-[#F5E6D3]/80 text-lg sm:text-base lg:text-lg mb-2">
                {formatTime(event.start_time)} - {formatTime(event.end_time)}
              </p>
              <p className="text-[#F5E6D3]/60 text-base">{event.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        chunk(displayEvents, [3, 2]).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              'grid gap-6',
              rowIndex === 0
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 mx-auto'
            )}
          >
            {row.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-6 rounded-lg
                         flex flex-col items-center text-center transition-all duration-300 
                         hover:bg-black/30 hover:border-[#F5E6D3]/20 hover:shadow-lg 
                         hover:shadow-[#E4A853]/5"
              >
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {event.is_recurring ? (
                    event.recurring_days?.map((day: string) => (
                      <div
                        key={day}
                        className="bg-[#E4A853]/20 text-[#E4A853] px-3 py-1 rounded-md text-xs font-medium tracking-wider uppercase"
                      >
                        {day}
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#E4A853]/20 text-[#E4A853] px-3 py-1 rounded-md text-sm">
                      {format(new Date(event.event_date!), 'MMM dd')}
                    </div>
                  )}
                </div>
                <h3 className="text-2xl sm:text-xl lg:text-2xl font-playfair text-[#F5E6D3] mb-3">
                  {event.title}
                </h3>
                <p className="text-[#F5E6D3]/80 text-lg sm:text-base lg:text-lg mb-2">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </p>
                <p className="text-[#F5E6D3]/60 text-base">
                  {event.description}
                </p>
              </motion.div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

function formatTime(timeStr: string | null) {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'h:mm a');
}

function chunk<T>(array: T[], sizes: number[]): T[][] {
  const chunks: T[][] = [];
  let index = 0;

  for (const size of sizes) {
    if (index < array.length) {
      chunks.push(array.slice(index, index + size));
      index += size;
    }
  }

  if (index < array.length) {
    chunks.push(array.slice(index));
  }

  return chunks;
}
