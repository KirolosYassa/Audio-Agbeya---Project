export type FeastTier = 'major' | 'minor' | 'other';
export type EventKind = 'feast' | 'fast' | 'weekly' | 'monthly';
/** Whether a fast begins or ends on the day ('' = a day in the middle of it). */
export type FastEdge = 'start' | 'end' | '';
export interface CalendarEvent { kind: EventKind; name: string; tier?: FeastTier; edge?: FastEdge }
