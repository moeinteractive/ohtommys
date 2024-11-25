'use client';

import { AdminNav } from '@/app/components/admin/AdminNav';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DeleteAlert } from '@/components/ui/delete-alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TimePicker } from '@/components/ui/time-picker';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

type Event = {
  id: string;
  title: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  description: string;
  is_recurring: boolean;
  recurring_days: string[] | null;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    event_date: null,
    description: '',
    is_recurring: false,
    start_time: null,
    end_time: null,
    recurring_days: null,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log('Loading events from database...');
    const { data: eventData, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error loading events:', error);
      return;
    }

    console.log('Events loaded:', eventData);
    if (eventData) setEvents(eventData);
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  const renderEventCard = (event: Event) => (
    <div
      key={event.id}
      className="bg-white border border-[#2C5530]/20 hover:border-[#2C5530]/30 rounded-lg shadow-sm transition-all duration-200"
    >
      <div className="flex-1">
        {editingEvent === event.id ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={event.title}
                  onChange={(e) =>
                    setEvents(
                      events.map((ev) =>
                        ev.id === event.id
                          ? { ...ev, title: e.target.value }
                          : ev
                      )
                    )
                  }
                />
              </div>
              {!event.is_recurring && (
                <div>
                  <Label>Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={event.event_date || ''}
                      onChange={(e) =>
                        setEvents(
                          events.map((ev) =>
                            ev.id === event.id
                              ? { ...ev, event_date: e.target.value }
                              : ev
                          )
                        )
                      }
                      className="w-full px-3 py-2 appearance-none"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
              <div className="relative">
                <TimePicker
                  label="Start Time"
                  date={
                    event.start_time
                      ? new Date(`1970-01-01T${event.start_time}`)
                      : undefined
                  }
                  setDate={(date) => {
                    if (date) {
                      const timeString = date
                        .toTimeString()
                        .split(' ')[0]
                        .slice(0, 5);
                      setEvents(
                        events.map((ev) =>
                          ev.id === event.id
                            ? { ...ev, start_time: timeString }
                            : ev
                        )
                      );
                    }
                  }}
                />
              </div>
              <div className="relative">
                <TimePicker
                  label="End Time"
                  date={
                    event.end_time
                      ? new Date(`1970-01-01T${event.end_time}`)
                      : undefined
                  }
                  setDate={(date) => {
                    if (date) {
                      const timeString = date
                        .toTimeString()
                        .split(' ')[0]
                        .slice(0, 5);
                      setEvents(
                        events.map((ev) =>
                          ev.id === event.id
                            ? { ...ev, end_time: timeString }
                            : ev
                        )
                      );
                    }
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={event.description}
                onChange={(e) =>
                  setEvents(
                    events.map((ev) =>
                      ev.id === event.id
                        ? { ...ev, description: e.target.value }
                        : ev
                    )
                  )
                }
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingEvent(null)}>
                Cancel
              </Button>
              <Button onClick={() => updateEvent(event.id)}>Save</Button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex items-center justify-between gap-4 mb-2">
              <h3 className="font-medium text-lg text-[#2C5530] leading-tight">
                {event.title}
              </h3>
              <div className="flex gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEditingEvent(editingEvent === event.id ? null : event.id)
                  }
                  className="h-8 w-8 p-0 text-[#2C5530] hover:text-[#2C5530] hover:bg-[#2C5530]/10"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(event.id)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-[#2C5530]/70">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>
                  {event.is_recurring
                    ? event.recurring_days
                        ?.map(
                          (day) => day.charAt(0).toUpperCase() + day.slice(1)
                        )
                        .join(', ')
                    : formatDate(event.event_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#2C5530]/70">
                <Clock className="h-4 w-4 shrink-0" />
                <span>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </span>
              </div>
              {event.description && (
                <div className="flex gap-2 text-[#2C5530]/60 mt-2">
                  <span className="text-sm">{event.description}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const addEvent = async () => {
    if (!newEvent.title) {
      toast({
        title: 'Error',
        description: 'Please enter a title for the event',
        variant: 'destructive',
      });
      return;
    }

    const eventToAdd = {
      ...newEvent,
      event_date: newEvent.event_date || null,
      start_time: newEvent.start_time || null,
      end_time: newEvent.end_time || null,
      recurring_days: newEvent.recurring_days || null,
    };

    console.log('Adding new event:', eventToAdd);
    const { data, error } = await supabase
      .from('events')
      .insert([eventToAdd])
      .select();

    if (error) {
      console.error('Error adding event:', error);
      toast({
        title: 'Error',
        description: 'Failed to add event',
        variant: 'destructive',
      });
      return;
    }

    console.log('Event added successfully:', data);
    if (data) {
      setEvents([...events, data[0]]);
      setNewEvent({
        title: '',
        event_date: null,
        description: '',
        is_recurring: false,
        start_time: null,
        end_time: null,
        recurring_days: null,
      });
      toast({
        title: 'Success',
        description: 'Event added successfully',
      });
    }
  };

  const updateEvent = async (id: string) => {
    const eventToUpdate = events.find((event) => event.id === id);
    if (!eventToUpdate) return;

    console.log('Updating event:', eventToUpdate);
    const { error } = await supabase
      .from('events')
      .update(eventToUpdate)
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
      return;
    }

    console.log('Event updated successfully');
    setEditingEvent(null);
    toast({
      title: 'Success',
      description: 'Event updated successfully',
    });
  };

  const deleteEvent = async (id: string) => {
    console.log('Deleting event with ID:', id);
    const { error } = await supabase.from('events').delete().eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
      return;
    }

    console.log('Event deleted successfully');
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: 'Success',
      description: 'Event deleted successfully',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="container mx-auto py-12 px-4">
        {/* Header Section */}
        <div className="text-center mb-12 relative">
          <div className="bg-[#F5F5F5] pt-16 pb-4">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#2C5530] mb-4 tracking-tight drop-shadow-lg">
              Events Management
            </h1>
            <p className="text-lg md:text-xl text-[#2C5530]/80 font-sans uppercase tracking-[0.2em] mb-6">
              Manage Live Events & Entertainment
            </p>
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-16 md:w-24 h-px bg-[#E4A853]"></div>
              <Calendar
                className="h-6 md:h-8 w-6 md:w-8 text-[#E4A853]"
                aria-hidden="true"
              />
              <div className="w-16 md:w-24 h-px bg-[#E4A853]"></div>
            </div>
          </div>
          <div className="mt-6">
            <AdminNav />
          </div>
        </div>

        {/* Add max-w-4xl wrapper around the content */}
        <div className="max-w-4xl mx-auto">
          {/* Add New Event Section */}
          <Accordion type="single" collapsible className="mt-12">
            <AccordionItem
              value="add-event"
              className="border-2 border-[#2C5530] bg-white shadow-xl rounded-lg"
            >
              <AccordionTrigger className="px-6 py-4 border-b border-[#2C5530]/10 hover:bg-[#2C5530]/5 transition-colors duration-200 group">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#2C5530]" />
                    <span className="text-2xl font-serif text-[#2C5530]">
                      Add New Event
                    </span>
                  </div>
                  <div className="text-sm text-[#2C5530]/70 group-hover:text-[#2C5530]">
                    Click to expand
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-[#2C5530]">Title</Label>
                      <Input
                        value={newEvent.title}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, title: e.target.value })
                        }
                        className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                      />
                    </div>
                    {!newEvent.is_recurring && (
                      <div>
                        <Label className="text-[#2C5530]">Date</Label>
                        <div className="relative">
                          <Input
                            type="date"
                            value={newEvent.event_date || ''}
                            onChange={(e) =>
                              setNewEvent({
                                ...newEvent,
                                event_date: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 appearance-none border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                            style={{ colorScheme: 'light' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    <div className="relative">
                      <TimePicker
                        label="Start Time"
                        date={
                          newEvent.start_time
                            ? new Date(`1970-01-01T${newEvent.start_time}`)
                            : undefined
                        }
                        setDate={(date) => {
                          if (date) {
                            const timeString = date
                              .toTimeString()
                              .split(' ')[0]
                              .slice(0, 5);
                            setNewEvent({
                              ...newEvent,
                              start_time: timeString,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="relative">
                      <TimePicker
                        label="End Time"
                        date={
                          newEvent.end_time
                            ? new Date(`1970-01-01T${newEvent.end_time}`)
                            : undefined
                        }
                        setDate={(date) => {
                          if (date) {
                            const timeString = date
                              .toTimeString()
                              .split(' ')[0]
                              .slice(0, 5);
                            setNewEvent({ ...newEvent, end_time: timeString });
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-[#2C5530]">Description</Label>
                    <Textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      className="border-[#2C5530] focus:ring-[#E4A853] text-[#2C5530]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_recurring"
                      checked={newEvent.is_recurring}
                      onCheckedChange={(checked) =>
                        setNewEvent({
                          ...newEvent,
                          is_recurring: checked as boolean,
                        })
                      }
                    />
                    <Label htmlFor="is_recurring" className="text-[#2C5530]">
                      Recurring Event
                    </Label>
                  </div>

                  {newEvent.is_recurring && (
                    <div>
                      <Label className="text-[#2C5530]">Recurring Days</Label>
                      <div className="flex gap-2 flex-wrap">
                        {[
                          'wednesday',
                          'thursday',
                          'friday',
                          'saturday',
                          'sunday',
                        ].map((day) => (
                          <div
                            key={day}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={day}
                              checked={newEvent.recurring_days?.includes(day)}
                              onCheckedChange={(checked) => {
                                const currentDays =
                                  newEvent.recurring_days || [];
                                setNewEvent({
                                  ...newEvent,
                                  recurring_days: checked
                                    ? [...currentDays, day]
                                    : currentDays.filter((d) => d !== day),
                                });
                              }}
                            />
                            <Label
                              htmlFor={day}
                              className="text-[#2C5530] capitalize"
                            >
                              {day}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={addEvent}
                      className="bg-[#2C5530] text-[#F5F5F5] hover:bg-[#2C5530]/90 px-12 w-auto"
                    >
                      Add Event
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Events List Section */}
          <Card className="border-2 border-[#2C5530] bg-[#F5F5F5] shadow-lg mb-8">
            <CardHeader className="border-b border-[#2C5530]/10 px-4 py-3">
              <CardTitle className="text-xl sm:text-2xl font-serif text-[#2C5530] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Special Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {events
                .filter((event) => !event.is_recurring)
                .map(renderEventCard)}
            </CardContent>
          </Card>

          {/* Recurring Events Section */}
          <Card className="border-2 border-[#2C5530] bg-white shadow-xl">
            <CardHeader className="border-b border-[#2C5530]/10 px-4 py-3">
              <CardTitle className="text-xl sm:text-2xl font-serif text-[#2C5530] flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recurring Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {events
                .filter((event) => event.is_recurring)
                .map(renderEventCard)}
            </CardContent>
          </Card>
        </div>
      </div>
      <DeleteAlert
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        onConfirm={() => {
          if (deleteId) {
            deleteEvent(deleteId);
            setDeleteId(null);
          }
        }}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
      />
    </div>
  );
}
