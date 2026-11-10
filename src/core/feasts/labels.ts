import type { CalendarEvent } from './types';

export function fastEdgeLabel(event: CalendarEvent): string {
  return event.edge === 'start' ? 'يبدأ ' + event.name : event.edge === 'end' ? 'آخر يوم من ' + event.name : event.name;
}

/** The text shown for an event: seasonal fasts say when they begin or end. */
export const eventLabel = (event: CalendarEvent): string => (event.kind === 'fast' ? fastEdgeLabel(event) : event.name);
