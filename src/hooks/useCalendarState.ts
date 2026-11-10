import { useCallback, useState } from 'react';
import { CALENDARS } from '../core/calendar/calendars';
import { moveMonth, viewOfJd } from '../core/calendar/month';
import { todayJd } from '../core/calendar/today';
import type { CalendarId } from '../core/calendar/types';
import { getPrefs, setPref } from '../services/prefsStore';

const initialMode = (): CalendarId => (getPrefs().calMode === 'gregorian' ? 'gregorian' : 'coptic');

/** The calendar screen's state: which calendar is shown, which month, and which day is selected. */
export function useCalendarState() {
  const [mode, setMode] = useState<CalendarId>(initialMode);
  const [selected, setSelected] = useState<number>(todayJd);
  const [view, setView] = useState(() => viewOfJd(mode, selected));
  const today = todayJd();

  const shiftMonths = useCallback((steps: number) => setView(current => moveMonth(mode, current, steps)), [mode]);
  const shiftYears = useCallback((steps: number) => shiftMonths(steps * CALENDARS[mode].monthsPerYear), [shiftMonths, mode]);

  const switchMode = useCallback((next: CalendarId) => {
    if (next === mode) return;
    setMode(next);
    setView(viewOfJd(next, selected));
    setPref('calMode', next);
  }, [mode, selected]);

  const goToday = useCallback(() => { setSelected(today); setView(viewOfJd(mode, today)); }, [mode, today]);

  return { mode, view, selected, today, select: setSelected, shiftMonths, shiftYears, switchMode, goToday };
}
