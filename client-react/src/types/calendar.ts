// src/types/calendar.ts
export type CalendarViewMode = 'day' | 'week';

export interface TimeSlot {
  hour: number;
  minute: number;
  time: string;
}

export interface CalendarEvent {
  id: number;
  start: Date;
  end: Date;
  lesson: any; // Lesson из существующих типов
}

export interface DayColumnProps {
  date: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number, minute: number) => void;
}