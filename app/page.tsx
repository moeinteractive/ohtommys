'use client';

import { Footer } from '@/components/footer2';
import { Header } from '@/components/header';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Beer, Calendar as CalendarIcon, Music, X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { IMaskInput } from 'react-imask';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Updated interfaces to match database schema
interface FacebookPost {
  id: string;
  full_picture?: string;
  message?: string;
  created_time: string;
}

// Updated business hours to match current requirements
const getTodayHours = () => {
  const today = new Date().getDay();

  switch (today) {
    case 0: // Sunday
      return '12:00 PM - 8:00 PM';
    case 1: // Monday
    case 2: // Tuesday
      return 'Closed';
    case 3: // Wednesday
    case 4: // Thursday
    case 6: // Saturday
      return '11:00 AM - 11:00 PM';
    case 5: // Friday
      return '11:00 AM - 12:00 AM';
    default:
      return '11:00 AM - 11:00 PM';
  }
};

// Utility functions to get business hours and current day
const getDayName = () => {
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

// Reusable custom button component with Celtic styling
const CelticButton = ({
  children,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden group
        px-8 py-4 rounded-none
        transition-all duration-300
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : `
              bg-[#3A725A] text-[#F5E6D3] 
              hover:bg-[#458B6D]
              border-2 border-[#F5E6D3]/30
              hover:border-[#F5E6D3]/50
              shadow-[0_2px_10px_rgba(0,0,0,0.1)]
              hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            `
        }
        ${className}
      `}
    >
      {/* Border effect */}
      <div className="absolute inset-[3px] border border-[#F5E6D3]/20 pointer-events-none" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="font-serif text-xl md:text-2xl uppercase tracking-[0.1em] text-[#F5E6D3]">
          {children}
        </span>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#F5E6D3]/30" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#F5E6D3]/30" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#F5E6D3]/30" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#F5E6D3]/30" />

      {/* Enhanced shine effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
        }}
      />
    </button>
  );
};

// Card component for displaying promotional content with Celtic styling
const PromotionCard = ({
  title,
  mainText,
  ctaText,
  imageSrc,
  onClick,
}: {
  title: string;
  mainText: string;
  ctaText: string;
  imageSrc: string;
  onClick?: () => void;
}) => {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      {/* Main container with decorative border */}
      <div className="relative border-2 border-[#E4A853]/30 bg-black/40 backdrop-blur-sm h-full p-1">
        {/* Celtic corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E4A853]" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E4A853]" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E4A853]" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E4A853]" />

        {/* Content Container */}
        <div className="h-full flex flex-col">
          {/* Image Container */}
          <div className="relative h-[300px]">
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient overlay with reduced opacity */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          </div>

          {/* Text Content */}
          <div className="relative flex-grow flex flex-col p-8 bg-gradient-to-b from-black/90 to-[#001F0F]/90">
            {/* Decorative line above title */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-[#E4A853]" />

            <h3 className="font-playfair mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#F5E6D3] drop-shadow-lg animate-[fadeIn_1s_ease-out,slideUp_1s_ease-out]">
              {title}
            </h3>

            <p className="font-cormorant mb-6 sm:mb-12 max-w-2xl mx-auto text-xl sm:text-2xl lg:text-3xl text-[#F5E6D3] drop-shadow-lg font-semibold leading-tight animate-[fadeIn_2s_ease-out,slideUp_2s_ease-out]">
              {mainText}
            </p>

            {/* Custom styled button */}
            <button
              onClick={onClick}
              className="relative overflow-hidden group/btn w-full bg-[#E4A853] hover:bg-[#c28d3a] 
                       text-black font-bold py-4 px-8 rounded-lg transition-all duration-300 
                       transform hover:scale-105 hover:shadow-xl"
            >
              <div className="absolute inset-0 border border-black/10 rounded-lg" />
              <span className="relative font-playfair text-lg tracking-wider">
                {ctaText}
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 
                            transition-opacity duration-300 bg-gradient-to-r 
                            from-transparent via-white/10 to-transparent"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Update the SectionDivider component
const SectionDivider = () => (
  <div className="relative py-16 bg-[#001F0F]">
    <div className="container mx-auto px-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-[#E4A853]/20"></div>
        </div>
        <div className="relative flex items-center gap-6 px-6 bg-[#001F0F]">
          <div className="w-24 h-px bg-[#E4A853]"></div>
          <div className="w-4 h-4 rotate-45 border-2 border-[#E4A853]"></div>
          <div className="w-24 h-px bg-[#E4A853]"></div>
        </div>
      </div>
    </div>
  </div>
);

// Add this type for better organization
type EventType = 'weekly' | 'special';

// Update the getGridClass function in the EventsContent component
const getGridClass = (itemCount: number) => {
  // Base container classes
  const baseClasses = 'grid gap-6 max-w-6xl mx-auto';

  // Mobile-first approach
  switch (itemCount) {
    case 1:
      return `${baseClasses} grid-cols-1 max-w-lg mx-auto`; // Single centered column
    case 2:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2`; // 2 columns
    case 3:
      return `${baseClasses} grid-cols-1 sm:grid-cols-3`; // 3 columns
    case 4:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2`; // 2x2 grid
    case 5:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; // 3x2 grid with last 2 centered
    case 6:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; // Clean 3x2 grid
    case 7:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; // 3x3 with last one centered
    case 8:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; // 3x3 with last two centered
    case 9:
      return `${baseClasses} grid-cols-1 sm:grid-cols-3 lg:grid-cols-3`; // Clean 3x3 grid
    default:
      return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; // Default to 3 columns
  }
};

// First, add the Event type interface
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

// Add this helper function to format recurring days
const formatRecurringDays = (days: string[] | null) => {
  if (!days || days.length === 0) return '';

  // Capitalize first letter of each day
  const formattedDays = days.map(
    (day) => day.charAt(0).toUpperCase() + day.slice(1)
  );

  if (formattedDays.length <= 2) {
    return formattedDays.join(' & ');
  }

  // For more than 2 days, use commas and '&'
  const lastDay = formattedDays.pop();
  return `${formattedDays.join(', ')} & ${lastDay}`;
};

// Update the EventsContent component
const EventsContent = ({ type }: { type: EventType }) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all events once when component mounts
  useEffect(() => {
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
  }, []); // Only fetch once when component mounts

  // Filter events based on type without making additional API calls
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
    <div
      className={`grid gap-6 mx-auto max-w-6xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 ${
        displayEvents.length === 5
          ? '[&>*:nth-child(-n+3)]:lg:col-span-2 [&>*:nth-child(4)]:lg:col-start-2 [&>*:nth-child(4)]:lg:col-span-2 [&>*:nth-child(5)]:lg:col-start-4 [&>*:nth-child(5)]:lg:col-span-2'
          : 'lg:grid-cols-3'
      }`}
    >
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
              event.recurring_days?.map((day) => (
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
  );
};

// Add the formatTime utility function if not already present
const formatTime = (timeStr: string | null) => {
  if (!timeStr) return '';
  const [hours, minutes] = timeStr.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'h:mm a');
};

// Add this after the CelticButton component and before the PromotionCard component

const overlayStyles = `
  .pub-background {
    background: 
      linear-gradient(rgba(0, 31, 15, 0.92), rgba(0, 31, 15, 0.94)),
      url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"),
      url('/images/wood-texture.jpg');  /* This is where the wood texture is used */
    background-repeat: repeat, repeat, repeat;
    position: fixed;
    inset: 0;
    z-index: -1;
  }

  .ambient-light {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      circle at 50% 50%,
      rgba(228, 168, 83, 0.15) 0%,
      rgba(0, 31, 15, 0.2) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: -1;
  }

  .woven-overlay {
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zm20.97 0l9.315 9.314-1.414 1.414L34.828 0h2.83zM22.344 0L13.03 9.314l1.414 1.414L25.172 0h-2.83zM32 0l12.142 12.142-1.414 1.414L30 .828 17.272 13.556l-1.414-1.414L28 0h4zM.284 0l28 28-1.414 1.414L0 2.544V0h.284zM0 5.373l25.456 25.455-1.414 1.415L0 8.2V5.374zm0 5.656l22.627 22.627-1.414 1.414L0 13.86v-2.83zm0 5.656l19.8 19.8-1.415 1.413L0 19.514v-2.83zm0 5.657l16.97 16.97-1.414 1.415L0 25.172v-2.83zM0 28l14.142 14.142-1.414 1.414L0 30.828V28zm0 5.657L11.314 44.97 9.9 46.386l-9.9-9.9v-2.828zm0 5.657L8.485 47.8 7.07 49.212 0 42.143v-2.83zm0 5.657l5.657 5.657-1.414 1.415L0 47.8v-2.83zm0 5.657l2.828 2.83-1.414 1.413L0 53.456v-2.83zM54.627 60L30 35.373 5.373 60H8.2L30 38.2 51.8 60h2.827zm-5.656 0L30 41.03 11.03 60h2.828L30 43.858 46.142 60h2.83zm-5.656 0L30 46.686 16.686 60h2.83L30 49.515 40.485 60h2.83zm-5.657 0L30 52.343 22.344 60h2.83L30 55.172 34.828 60h2.83zM32 60l-2-2-2 2h4zM59.716 0l-28 28 1.414 1.414L60 2.544V0h-.284zM60 5.373L34.544 30.828l1.414 1.414L60 8.2V5.374zm0 5.656L37.373 33.656l1.414 1.414L60 13.86v-2.83zm0 5.656l-19.8 19.8 1.415 1.413L60 19.514v-2.83zm0 5.657l-16.97 16.97 1.414 1.415L60 25.172v-2.83zM60 28L45.858 42.142l1.414 1.414L60 30.828V28zm0 5.657L48.686 44.97l1.415 1.415L60 42.143v-2.83zm0 5.657L51.515 47.8l1.414 1.414L60 47.8v-2.83zm0 5.657l-5.657 5.657 1.414 1.415L60 53.456v-2.83zM39.9 16.385l1.414-1.414L30 3.658 18.686 14.97l1.415 1.415 9.9-9.9 9.9 9.9zm-2.83 2.828l1.415-1.414L30 9.313 21.515 17.8l1.414 1.413 7.07-7.07 7.07 7.07zm-2.827 2.83l1.414-1.416L30 14.97l-5.657 5.657 1.414 1.415L30 17.8l4.242 4.242zm-2.83 2.827l1.414-1.414L30 20.626l-2.828 2.83 1.414 1.414L30 23.456l1.414 1.414zM56.87 59.414L58.284 58 30 29.716 1.716 58l1.414 1.414L30 32.544l26.87 26.87z' fill='%23E4A853' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    position: absolute;
    inset: 0;
    opacity: 0;
    animation: fadeInOut 10s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes fadeInOut {
    0% { opacity: 0; }
    50% { opacity: 0.15; }
    100% { opacity: 0; }
  }

  /* Add these global styles */
  html, body {
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }

  #__next {
    overflow-x: hidden;
    width: 100%;
    position: relative;
  }
`;

// Add this interface near the top with other interfaces
interface JobApplicationFormData {
  name: string;
  phone: string;
  email: string;
  startDate: string;
  position: string;
  availableDays: string[];
  shifts: string[];
  experience: string;
}

// Then update the validateForm function to use this interface
const validateForm = (data: JobApplicationFormData) => {
  const errors: Partial<Record<keyof JobApplicationFormData, string>> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.phone.replace(/[^0-9]/g, '').match(/^\d{10}$/)) {
    errors.phone = 'Valid phone number is required';
  }

  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required';
  }

  if (!data.position) {
    errors.position = 'Please select a position';
  }

  if (data.availableDays.length === 0) {
    errors.availableDays = 'Please select at least one day';
  }

  if (data.shifts.length === 0) {
    errors.shifts = 'Please select at least one shift';
  }

  if (!data.experience.trim()) {
    errors.experience = 'Experience details are required';
  }

  return errors;
};

// Main page component
export default function Page() {
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [formStatus, setFormStatus] = React.useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [formError, setFormError] = React.useState<string>('');

  // Add Facebook posts states
  const [posts, setPosts] = React.useState<FacebookPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true);
  const [postsError, setPostsError] = React.useState<string | null>(null);

  // Add removeHashtags function
  const removeHashtags = (message: string) => {
    return message
      .split(/\s+/)
      .filter((word) => !word.includes('#'))
      .join(' ')
      .trim()
      .replace(/\s+([.,!?])(\s|$)/g, '$1$2')
      .trim();
  };

  // Add useEffect to load posts
  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch('/api/facebook-posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPostsError(
          err instanceof Error ? err.message : 'Failed to fetch posts'
        );
        setPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    loadPosts();
  }, []);

  // Add handleNavigation function inside component
  const handleNavigation = (href: string) => {
    if (href.startsWith('/#')) {
      const elementId = href.split('#')[1];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Update the handleSubmit function to use the correct type
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFormStatus('submitting');
    setFormError('');

    const formData = new FormData(event.currentTarget);
    const data: JobApplicationFormData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      startDate: date ? format(date, 'yyyy-MM-dd') : '',
      position: formData.get('position') as string,
      availableDays: formData.getAll('availableDays') as string[],
      shifts: formData.getAll('shifts') as string[],
      experience: formData.get('experience') as string,
    };

    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
      setFormStatus('error');
      setFormError('Please fill in all required fields correctly.');
      return;
    }

    // Process valid form submission
    try {
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Handle successful submission
      setFormStatus('success');
      event.currentTarget.reset();
      setDate(undefined);
    } catch (error) {
      console.error('Error submitting application:', error);
      setFormStatus('error');
      setFormError('Failed to submit application. Please try again later.');
    }
  };

  // Remove unused utility functions or use them where needed
  const hours = React.useMemo(() => {
    const today = new Date().getDay();
    switch (today) {
      case 0: // Sunday
        return '12:00 PM - 8:00 PM';
      case 1: // Monday
      case 2: // Tuesday
        return 'Closed';
      case 3: // Wednesday
      case 4: // Thursday
      case 6: // Saturday
        return '11:00 AM - 11:00 PM';
      case 5: // Friday
        return '11:00 AM - 12:00 AM';
      default:
        return '11:00 AM - 11:00 PM';
    }
  }, []);

  // Handle mounting state
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    // Check if there's a stored scroll target
    const scrollTarget = sessionStorage.getItem('scrollTarget');
    if (scrollTarget) {
      // Clear the stored target
      sessionStorage.removeItem('scrollTarget');
      // Find the element and scroll to it
      const element = document.getElementById(scrollTarget);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); // Small delay to ensure the page is fully loaded
      }
    }
  }, []);

  const [activeEventType, setActiveEventType] = React.useState<
    'weekly' | 'special'
  >('weekly');
  const [animateButton, setAnimateButton] = React.useState<
    'weekly' | 'special'
  >('special');

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <style jsx global>
        {overlayStyles}
      </style>

      <Header />
      <main className="flex-1 relative w-full">
        {/* Hero Section with video background */}
        <section className="relative h-screen flex flex-col w-full" id="home">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover brightness-[0.75]"
          >
            <source src="/images/video.mp4" type="video/mp4" />
          </video>

          {/* Lighter gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />

          {/* Main content wrapper - using flex for proper centering */}
          <div className="relative flex flex-col h-full">
            {/* Center content wrapper - true vertical centering */}
            <div className="flex-1 flex items-center justify-center px-4">
              {/* Main Content Box */}
              <div className="relative p-6 sm:p-8 bg-black/25 backdrop-blur-[2px] rounded-lg border-2 border-[#F5E6D3]/10 w-full max-w-4xl mx-auto text-center">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

                <h1 className="font-playfair mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-[#F5E6D3] drop-shadow-lg animate-[fadeIn_1s_ease-out,slideUp_1s_ease-out]">
                  Great Food, Fine Drinks, Good Times &
                  <span className="font-great-vibes block text-[#E4A853] drop-shadow-lg text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 sm:mt-4 animate-[fadeIn_1.5s_ease-out,slideUp_1.5s_ease-out]">
                    Old Friends
                  </span>
                </h1>

                <div className="flex items-center justify-center gap-4 my-4 sm:my-8">
                  <div className="w-16 sm:w-24 h-px bg-[#E4A853]" />
                  <div className="w-3 sm:w-4 h-3 sm:h-4 rotate-45 border-2 border-[#E4A853]" />
                  <div className="w-16 sm:w-24 h-px bg-[#E4A853]" />
                </div>

                <p className="font-cormorant mb-6 sm:mb-12 max-w-2xl mx-auto text-xl sm:text-2xl lg:text-3xl text-[#F5E6D3] drop-shadow-lg font-semibold leading-tight animate-[fadeIn_2s_ease-out,slideUp_2s_ease-out]">
                  Experience authentic Irish hospitality at the Lake of the
                  Ozarks&apos; finest pub & grill
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full max-w-xl mx-auto animate-[fadeIn_2.5s_ease-out,slideUp_2.5s_ease-out]">
                  <CelticButton
                    onClick={() => (window.location.href = '/full-menu')}
                    className="flex-1 shadow-lg text-sm sm:text-base lg:text-xl py-2 px-4 sm:py-4 sm:px-8"
                  >
                    VIEW FULL MENU
                  </CelticButton>
                  <CelticButton
                    onClick={() => (window.location.href = '/specials')}
                    className="flex-1 shadow-lg text-sm sm:text-base lg:text-xl py-2 px-4 sm:py-4 sm:px-8"
                  >
                    VIEW SPECIALS
                  </CelticButton>
                </div>
              </div>
            </div>

            {/* Hours Section - Positioned at bottom of viewport */}
            <div className="w-full mt-auto">
              {' '}
              {/* Using mt-auto to push to bottom */}
              <div className="bg-gradient-to-t from-black/90 to-transparent">
                <div className="container mx-auto px-4 w-full">
                  <div className="grid grid-cols-3 gap-2 md:gap-8 text-center max-w-4xl mx-auto border-2 border-[#F5E6D3]/10 bg-black/40 backdrop-blur-sm p-4 rounded-t-lg">
                    <div className="border-r border-[#F5E6D3]/20 px-1 md:px-8">
                      <p className="font-cormorant text-base md:text-lg font-semibold text-[#F5E6D3]/80">
                        Monday-Tuesday
                      </p>
                      <p className="text-[#F5E6D3]/50 text-base md:text-lg font-medium">
                        Closed
                      </p>
                    </div>
                    <div className="border-r border-[#F5E6D3]/20 px-1 md:px-8">
                      <p className="font-cormorant text-base md:text-lg font-semibold text-[#F5E6D3]/80">
                        Wed-Saturday
                      </p>
                      <p className="text-[#4ADE80] text-base md:text-lg font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                        11am - 11pm
                      </p>
                    </div>
                    <div className="px-1 md:px-8">
                      <p className="font-cormorant text-base md:text-lg font-semibold text-[#F5E6D3]/80">
                        Sunday
                      </p>
                      <p className="text-[#4ADE80] text-base md:text-lg font-bold drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                        12pm - 8pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add background elements before the Experience section */}
        <div className="pub-background" />
        <div className="ambient-light" />
        <div className="woven-overlay" />

        {/* Experience Section */}
        <section className="relative py-32" id="experience">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="relative p-4 sm:p-6 md:p-8 bg-black/20 backdrop-blur-sm rounded-lg border-2 border-[#F5E6D3]/10 mb-12 md:mb-16 lg:mb-20 max-w-4xl mx-auto">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

              <div className="text-center">
                <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#F5E6D3] mb-4 md:mb-6">
                  Experience Oh Tommy&apos;s
                </h2>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-24 h-px bg-[#E4A853]" />
                  <Beer className="h-8 w-8 text-[#E4A853]" />
                  <div className="w-24 h-px bg-[#E4A853]" />
                </div>

                <p className="font-cormorant text-xl sm:text-2xl lg:text-3xl text-[#F5E6D3]/80 max-w-3xl mx-auto italic">
                  Your Home Away From Home at the Lake of the Ozarks&apos;
                  finest pub & grill
                </p>
              </div>
            </div>

            {/* Promotion Cards Grid */}
            <div className="grid gap-8 lg:grid-cols-3 grid-cols-1 max-w-6xl mx-auto">
              {[
                {
                  title: 'Live Entertainment',
                  mainText:
                    'Featuring the best local bands and entertainment at the Lake. Join us for live music, karaoke nights, and more!',
                  ctaText: 'View Schedule',
                  imageSrc: '/images/band.jpg',
                  onClick: () => handleNavigation('/#events'),
                },
                {
                  title: 'Cornhole & Karaoke',
                  mainText:
                    'Join us every Thursday for competitive cornhole tournaments and karaoke! Win prizes, enjoy drink specials, and show off your singing skills.',
                  ctaText: 'Join The Fun',
                  imageSrc: '/images/corhole2.jpg',
                  onClick: () => handleNavigation('/#events'),
                },
                {
                  title: 'Special Events',
                  mainText:
                    'From holiday celebrations to Bike Fest and our KC Chiefs games! Join us for themed parties, decorations, special menus, and unforgettable memories with friends and family.',
                  ctaText: 'SEE ALL EVENTS',
                  imageSrc: '/images/halloween.jpg',
                  onClick: () => handleNavigation('/#events'),
                },
              ].map((promo, index) => (
                <motion.div
                  key={promo.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative group h-full flex flex-col overflow-hidden rounded-none border-2 border-[#F5E6D3]/10 bg-black/20 backdrop-blur-sm lg:max-w-none max-w-full mx-auto"
                >
                  {/* Card content */}
                  <div className="relative h-full flex flex-col min-[500px]:flex-row lg:flex-col p-1">
                    {/* Image Container */}
                    <div className="relative w-full min-[500px]:w-[40%] lg:w-full h-[250px] min-[500px]:h-full lg:h-[300px] flex-shrink-0">
                      <Image
                        src={promo.imageSrc}
                        alt={promo.title}
                        fill
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 500px) 100vw, (max-width: 1024px) 40vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="relative flex-grow flex flex-col justify-between p-4 lg:p-6 bg-gradient-to-b from-black/90 to-[#001F0F]/90 w-full min-[500px]:w-[60%] lg:w-full">
                      <div>
                        <h3 className="font-playfair text-2xl min-[500px]:text-3xl lg:text-3xl text-center text-[#E4A853] mb-2 min-[500px]:mb-3 lg:mb-6">
                          {promo.title}
                        </h3>
                        <p className="font-cormorant text-lg min-[500px]:text-xl lg:text-2xl text-center text-[#F5E6D3] leading-tight lg:leading-relaxed">
                          {promo.mainText}
                        </p>
                      </div>
                      <CelticButton
                        onClick={promo.onClick}
                        className="w-full mt-4 text-xs min-[500px]:text-sm lg:text-xl py-1 min-[500px]:py-1.5 lg:py-4 px-2 lg:px-8"
                      >
                        {promo.ctaText}
                      </CelticButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Info Card */}
            <div className="mt-20 text-center">
              <div className="inline-flex flex-col items-center gap-4 relative">
                {/* Title */}
                <div className="flex items-center gap-3 text-[#E4A853]">
                  <CalendarIcon className="h-8 w-8" />
                  <span className="font-cormorant font-semibold text-3xl md:text-4xl">
                    Daily Specials & Events
                  </span>
                </div>

                {/* Decorative line */}
                <div className="flex items-center justify-center gap-4 my-6">
                  <div className="w-24 h-px bg-[#E4A853]/50" />
                  <div className="w-4 h-4 rotate-45 border-2 border-[#E4A853]/50" />
                  <div className="w-24 h-px bg-[#E4A853]/50" />
                </div>

                {/* Text */}
                <p className="font-cormorant text-2xl md:text-3xl text-[#F5E6D3] tracking-wider">
                  Live Music Every Weekend • Karaoke • Sports • Holiday
                  Celebrations
                </p>

                {/* Decorative corners */}
                <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-[#E4A853]/20" />
                <div className="absolute -top-6 -right-6 w-12 h-12 border-t-2 border-r-2 border-[#E4A853]/20" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-2 border-l-2 border-[#E4A853]/20" />
                <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-[#E4A853]/20" />
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="relative py-16 md:py-24 lg:py-32">
          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            {/* Section Header */}
            <div className="relative p-4 md:p-8 bg-black/20 backdrop-blur-sm rounded-lg border-2 border-[#F5E6D3]/10 mb-12 md:mb-20 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5E6D3] mb-4 md:mb-6">
                  Events & Entertainment
                </h2>

                <div className="flex items-center justify-center gap-4 mb-6 md:mb-8">
                  <div className="w-16 md:w-24 h-px bg-[#E4A853]" />
                  <Music className="h-6 w-6 md:h-8 md:w-8 text-[#E4A853]" />
                  <div className="w-16 md:w-24 h-px bg-[#E4A853]" />
                </div>

                <p className="font-cormorant text-xl md:text-2xl lg:text-3xl text-[#F5E6D3]/80 max-w-3xl mx-auto italic mb-8 md:mb-12">
                  Join us for live music, karaoke, and special celebrations
                </p>

                {/* Two Buttons Container */}
                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center max-w-2xl mx-auto">
                  {/* Weekly Events Button */}
                  <div className="flex-1">
                    <CelticButton
                      onClick={() => {
                        setActiveEventType('weekly');
                        setAnimateButton('special');
                      }}
                      className={cn(
                        'w-full text-base md:text-xl py-3 md:py-6',
                        activeEventType === 'weekly'
                          ? 'bg-[#3A725A]'
                          : 'opacity-80'
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 md:gap-2">
                        <span className="text-xl md:text-2xl">
                          Weekly Events
                        </span>
                        <span className="text-xs md:text-sm font-cormorant opacity-80">
                          Live Music • Karaoke • Cornhole
                        </span>
                      </div>
                    </CelticButton>
                  </div>

                  {/* Special Events Button */}
                  <div className="flex-1 relative">
                    <CelticButton
                      onClick={() => {
                        setActiveEventType('special');
                        setAnimateButton('weekly');
                      }}
                      className={cn(
                        'w-full text-base md:text-xl py-3 md:py-6',
                        activeEventType === 'special'
                          ? 'bg-[#3A725A]'
                          : 'opacity-80'
                      )}
                    >
                      <div className="flex flex-col items-center gap-1 md:gap-2">
                        <span className="text-xl md:text-2xl">
                          Special Events
                        </span>
                        <span className="text-xs md:text-sm font-cormorant opacity-80">
                          Holidays • Sports • Celebrations
                        </span>
                      </div>
                    </CelticButton>

                    {/* Pointing Hand - Responsive positioning */}
                    {activeEventType === 'weekly' && (
                      <div className="absolute -bottom-12 md:-bottom-16 -right-8 md:-right-16 animate-point-to-click">
                        <div className="relative">
                          <span className="text-[#E4A853] text-3xl md:text-4xl rotate-45">
                            👆
                          </span>
                          <span className="absolute -top-12 md:-top-16 right-0 bg-[#2A4E45] text-[#F5E6D3] px-3 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-sm whitespace-nowrap">
                            Click to see more!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Events List Container */}
            <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-4 md:p-8 mt-8 md:mt-12">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  key={activeEventType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <EventsContent type={activeEventType} />
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section id="jobs" className="relative py-32">
          <div className="container max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
            {/* Section Header */}
            <div className="relative p-8 bg-black/20 backdrop-blur-sm rounded-lg border-2 border-[#F5E6D3]/10 mb-20 max-w-4xl mx-auto">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

              <div className="text-center">
                <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5E6D3] mb-6">
                  Job Openings
                </h2>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-24 h-px bg-[#E4A853]" />
                  <Beer className="h-8 w-8 text-[#E4A853]" />
                  <div className="w-24 h-px bg-[#E4A853]" />
                </div>

                <p className="font-cormorant text-2xl md:text-3xl text-[#F5E6D3]/80 max-w-3xl mx-auto italic">
                  Become part of our family at Oh Tommy&apos;s
                </p>
              </div>
            </div>

            {/* Application Form */}
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-8 md:p-12">
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

                <form onSubmit={handleSubmit} className="grid gap-6">
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-[#E4A853] text-lg mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        name="name"
                        className="bg-black/50 border-[#F5E6D3]/20 text-[#F5E6D3] h-12 text-lg focus:border-[#E4A853] focus:ring-[#E4A853]"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#E4A853] text-lg mb-2 block">
                        Phone Number
                      </Label>
                      <IMaskInput
                        mask="(000) 000-0000"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full bg-black/50 border-[#F5E6D3]/20 text-[#F5E6D3] h-12 text-lg rounded-md px-3 border focus:ring-[#E4A853] focus:border-[#E4A853]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-[#E4A853] text-lg mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        className="bg-black/50 border-[#F5E6D3]/20 text-[#F5E6D3] h-12 text-lg focus:border-[#E4A853] focus:ring-[#E4A853]"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-[#E4A853] text-lg mb-2 block">
                        When Can You Start?
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full bg-black/50 border-[#F5E6D3]/20 text-[#F5E6D3] h-12 text-lg justify-start text-left font-normal hover:bg-black/60',
                              !date && 'text-[#F5E6D3]/60'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                              format(date, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Position Selection */}
                  <div>
                    <Label className="text-[#E4A853] text-lg mb-2 block">
                      Position Interest
                    </Label>
                    <select
                      name="position"
                      defaultValue=""
                      className="w-full appearance-none bg-black/50 border-2 border-[#F5E6D3]/20 text-[#F5E6D3] h-12 text-lg rounded-lg px-4 focus:border-[#E4A853] focus:ring-[#E4A853] transition-all duration-300"
                      required
                    >
                      <option value="" disabled className="text-[#F5E6D3]/60">
                        Select a position
                      </option>
                      <option value="cook" className="bg-[#001F0F]">
                        Cook
                      </option>
                      <option value="bartender" className="bg-[#001F0F]">
                        Bartender
                      </option>
                      <option value="waitstaff" className="bg-[#001F0F]">
                        Waitstaff
                      </option>
                    </select>
                  </div>

                  {/* Availability Section */}
                  <div className="space-y-4">
                    <Label className="text-[#E4A853] text-lg block">
                      Available Days to Work
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black/30 p-4 rounded-lg border border-[#F5E6D3]/10">
                      {[
                        { day: 'Monday', closed: true },
                        { day: 'Tuesday', closed: true },
                        { day: 'Wednesday', closed: false },
                        { day: 'Thursday', closed: false },
                        { day: 'Friday', closed: false },
                        { day: 'Saturday', closed: false },
                        { day: 'Sunday', closed: false },
                      ].map(({ day, closed }) => (
                        <div
                          key={day}
                          className={`flex items-center ${closed ? 'opacity-50' : ''}`}
                        >
                          <Checkbox
                            id={day.toLowerCase()}
                            name="availableDays"
                            value={day.toLowerCase()}
                            className="border-[#F5E6D3]/20 bg-black/50 text-[#E4A853] focus:ring-[#E4A853]"
                            disabled={closed}
                          />
                          <Label
                            htmlFor={day.toLowerCase()}
                            className={`text-[#F5E6D3] text-lg ml-2 ${
                              closed ? 'line-through' : ''
                            }`}
                          >
                            {day}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-[#E4A853]/60 text-sm italic">
                      Note: We are closed on Mondays and Tuesdays
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <Label className="text-[#E4A853] text-lg mb-2 block">
                      Experience
                    </Label>
                    <Textarea
                      name="experience"
                      className="bg-black/50 border-[#F5E6D3]/20 text-[#F5E6D3] min-h-[150px] text-lg focus:border-[#E4A853] focus:ring-[#E4A853]"
                      placeholder="Tell us about your relevant experience..."
                      required
                    />
                  </div>

                  {/* Form Status */}
                  {formStatus !== 'idle' && (
                    <div
                      className={cn(
                        'text-center p-4 rounded-lg',
                        formStatus === 'submitting' &&
                          'bg-[#E4A853]/10 text-[#E4A853]',
                        formStatus === 'success' &&
                          'bg-green-500/10 text-green-500',
                        formStatus === 'error' && 'bg-red-500/10 text-red-500'
                      )}
                    >
                      {formStatus === 'submitting' &&
                        'Submitting your application...'}
                      {formStatus === 'success' &&
                        'Application submitted successfully!'}
                      {formStatus === 'error' && formError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <CelticButton
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className="w-full mt-4"
                  >
                    {formStatus === 'submitting'
                      ? 'Submitting...'
                      : 'Submit Application'}
                  </CelticButton>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media Section - Facebook feed integration */}
        <section id="social" className="relative py-32">
          <div className="container mx-auto px-4 relative">
            {/* Section Header */}
            <div className="relative p-8 bg-black/20 backdrop-blur-sm rounded-lg border-2 border-[#F5E6D3]/10 mb-20 max-w-4xl mx-auto">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#F5E6D3]/20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#F5E6D3]/20" />

              <div className="text-center">
                <h2 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5E6D3] mb-6">
                  Latest Updates
                </h2>

                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-24 h-px bg-[#E4A853]" />
                  <Beer className="h-8 w-8 text-[#E4A853]" />
                  <div className="w-24 h-px bg-[#E4A853]" />
                </div>

                <p className="font-cormorant text-2xl md:text-3xl text-[#F5E6D3]/80 max-w-3xl mx-auto italic">
                  Stay connected with what&apos;s happening at Oh Tommy&apos;s
                </p>
              </div>
            </div>

            {/* Facebook Posts Grid */}
            <div className="w-full max-w-[1200px] mx-auto">
              {/* Add loading state */}
              {isLoadingPosts ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <div className="text-[#E4A853] text-xl">
                    Loading updates...
                  </div>
                </div>
              ) : postsError ? (
                <div className="flex justify-center items-center min-h-[300px]">
                  <div className="text-red-500 text-xl text-center">
                    <p>Error loading updates</p>
                    <p className="text-sm mt-2">{postsError}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <Dialog key={post.id}>
                      <DialogTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="relative group cursor-pointer"
                        >
                          <div className="relative bg-black/20 backdrop-blur-sm border-2 border-[#F5E6D3]/10 p-4 h-full transition-all duration-300 hover:border-[#F5E6D3]/30">
                            {/* Decorative corners */}
                            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#F5E6D3]/30" />
                            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#F5E6D3]/30" />
                            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#F5E6D3]/30" />
                            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#F5E6D3]/30" />

                            {post.full_picture && (
                              <div className="relative w-full h-[300px] mb-4 overflow-hidden">
                                <Image
                                  src={post.full_picture}
                                  alt="Facebook post image"
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                              </div>
                            )}

                            {post.message && (
                              <div className="flex-grow">
                                <p className="font-cormorant text-xl text-[#F5E6D3] mb-4 line-clamp-4">
                                  {removeHashtags(post.message)}
                                </p>
                              </div>
                            )}

                            <p className="text-[#E4A853] text-sm font-medium">
                              {new Date(post.created_time).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                }
                              )}
                            </p>
                          </div>
                        </motion.div>
                      </DialogTrigger>

                      <DialogContent className="max-w-[90vw] md:max-w-[800px] max-h-[90vh] overflow-y-auto bg-[#001F0F] border-[#F5E6D3]/20">
                        <DialogTitle className="sr-only">
                          Facebook Post Details
                        </DialogTitle>
                        <div className="absolute right-4 top-4 z-50">
                          <DialogClose className="rounded-full p-2 hover:bg-white/10 transition-colors">
                            <X className="h-6 w-6 text-[#F5E6D3]" />
                            <span className="sr-only">Close</span>
                          </DialogClose>
                        </div>

                        <div className="space-y-6">
                          {post.full_picture && (
                            <div className="relative w-full h-[500px] rounded-lg overflow-hidden border-2 border-[#F5E6D3]/10">
                              <Image
                                src={post.full_picture}
                                alt="Facebook post image"
                                fill
                                className="object-contain bg-black"
                                sizes="(max-width: 768px) 90vw, 800px"
                                priority
                              />
                            </div>
                          )}

                          {post.message && (
                            <div className="flex-grow">
                              <p className="font-cormorant text-xl text-[#F5E6D3]/90">
                                {removeHashtags(post.message)}
                              </p>
                            </div>
                          )}

                          <p className="text-[#E4A853] text-sm font-medium">
                            {new Date(post.created_time).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              )}
            </div>

            {/* Facebook Link Button */}
            <div className="mt-12 text-center">
              <CelticButton
                onClick={() =>
                  window.open(
                    'https://www.facebook.com/ohtommys.pubgrill',
                    '_blank'
                  )
                }
                className="w-full sm:w-auto"
              >
                Visit Our Facebook Page
              </CelticButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Global styles for fonts and animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Cormorant:wght@400;600&family=Great+Vibes&family=Irish+Grover&display=swap');

        .font-playfair {
          font-family: 'Playfair Display', serif;
        }

        .font-cormorant {
          font-family: 'Cormorant', serif;
        }

        .font-great-vibes {
          font-family: 'Great Vibes', cursive;
        }

        .font-irish {
          font-family: 'Irish Grover', cursive;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
          }
          to {
            transform: translateY(0);
          }
        }

        .celtic-pattern {
          background-color: #001f0f;
          opacity: 0.05;
          background-image: linear-gradient(
              30deg,
              #e4a853 12%,
              transparent 12.5%,
              transparent 87%,
              #e4a853 87.5%,
              #e4a853
            ),
            linear-gradient(
              150deg,
              #e4a853 12%,
              transparent 12.5%,
              transparent 87%,
              #e4a853 87.5%,
              #e4a853
            ),
            linear-gradient(
              30deg,
              #e4a853 12%,
              transparent 12.5%,
              transparent 87%,
              #e4a853 87.5%,
              #e4a853
            ),
            linear-gradient(
              150deg,
              #e4a853 12%,
              transparent 12.5%,
              transparent 87%,
              #e4a853 87.5%,
              #e4a853
            ),
            linear-gradient(
              60deg,
              #e4a85377 25%,
              transparent 25.5%,
              transparent 75%,
              #e4a85377 75%,
              #e4a85377
            ),
            linear-gradient(
              60deg,
              #e4a85377 25%,
              transparent 25.5%,
              transparent 75%,
              #e4a85377 75%,
              #e4a85377
            );
          background-size: 80px 140px;
          background-position:
            0 0,
            0 0,
            40px 70px,
            40px 70px,
            0 0,
            40px 70px;
        }

        .celtic-knot {
          background-color: #001f0f;
          opacity: 0.05;
          background-image: radial-gradient(
              circle at 100% 150%,
              #e4a853 24%,
              #001f0f 25%,
              #001f0f 28%,
              #e4a853 29%,
              #e4a853 36%,
              #001f0f 36%,
              #001f0f 40%,
              transparent 40%,
              transparent
            ),
            radial-gradient(
              circle at 0 150%,
              #e4a853 24%,
              #001f0f 25%,
              #001f0f 28%,
              #e4a853 29%,
              #e4a853 36%,
              #001f0f 36%,
              #001f0f 40%,
              transparent 40%,
              transparent
            ),
            radial-gradient(
              circle at 50% 100%,
              #e4a853 10%,
              #001f0f 11%,
              #001f0f 23%,
              #e4a853 24%,
              #e4a853 30%,
              #001f0f 31%,
              #001f0f 43%,
              transparent 43%,
              transparent
            ),
            radial-gradient(
              circle at 100% 50%,
              #e4a853 5%,
              #001f0f 6%,
              #001f0f 15%,
              #e4a853 16%,
              #e4a853 20%,
              #001f0f 21%,
              #001f0f 30%,
              transparent 30%,
              transparent
            ),
            radial-gradient(
              circle at 0 50%,
              #e4a853 5%,
              #001f0f 6%,
              #001f0f 15%,
              #e4a853 16%,
              #e4a853 20%,
              #001f0f 21%,
              #001f0f 30%,
              transparent 30%,
              transparent
            );
          background-size: 100px 50px;
        }

        .celtic-weave {
          background-color: #001f0f;
          opacity: 0.03;
          background-image: linear-gradient(
              45deg,
              #e4a853 12%,
              transparent 0,
              transparent 88%,
              #e4a853 0
            ),
            linear-gradient(
              -45deg,
              #e4a853 12%,
              transparent 0,
              transparent 88%,
              #e4a853 0
            ),
            linear-gradient(
              45deg,
              #e4a853 12%,
              transparent 0,
              transparent 88%,
              #e4a853 0
            ),
            linear-gradient(
              -45deg,
              #e4a853 12%,
              transparent 0,
              transparent 88%,
              #e4a853 0
            );
          background-size: 50px 50px;
          background-position:
            0 0,
            0 0,
            25px 25px,
            25px 25px;
        }

        /* Celtic Shamrock Pattern for Experience section */
        .celtic-shamrock {
          background-color: #001f0f;
          opacity: 0.05;
          background-image: radial-gradient(
              circle at 50% 50%,
              #e4a853 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at calc(50% + 10px) calc(50% - 10px),
              #e4a853 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at calc(50% - 10px) calc(50% - 10px),
              #e4a853 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at calc(50% + 10px) calc(50% + 10px),
              #e4a853 2px,
              transparent 2px
            ),
            radial-gradient(
              circle at calc(50% - 10px) calc(50% + 10px),
              #e4a853 2px,
              transparent 2px
            );
          background-size: 40px 40px;
          background-position: 0 0;
        }

        /* Celtic Interlace Pattern for Events section */
        .celtic-interlace {
          background-color: #001f0f;
          opacity: 0.05;
          background-image: linear-gradient(45deg, #e4a853 2px, transparent 2px),
            linear-gradient(-45deg, #e4a853 2px, transparent 2px),
            linear-gradient(
              45deg,
              transparent 2px,
              #e4a853 3px,
              transparent 3px
            ),
            linear-gradient(
              -45deg,
              transparent 2px,
              #e4a853 3px,
              transparent 3px
            );
          background-size: 30px 30px;
          background-position:
            0 0,
            0 0,
            15px 15px,
            15px 15px;
        }
      `}</style>
    </div>
  );
}
