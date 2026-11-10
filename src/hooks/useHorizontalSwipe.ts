import { useMemo } from 'react';
import { PanResponder } from 'react-native';
import { useLatest } from './useLatest';

const SWIPE_DISTANCE_PX = 70;
const MIN_DRAG_PX = 20;
const HORIZONTAL_BIAS = 1.6;

interface Handlers { onSwipeLeft?(): void; onSwipeRight?(): void }

/** Pan handlers that recognise a clearly horizontal swipe and call back when it is long enough.
    The handlers always call the latest callbacks, so they can be spread on a view without re-creating them. */
export function useHorizontalSwipe(handlers: Handlers) {
  const latest = useLatest(handlers);
  return useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > MIN_DRAG_PX && Math.abs(g.dx) > HORIZONTAL_BIAS * Math.abs(g.dy),
    onPanResponderRelease: (_, g) => {
      if (g.dx < -SWIPE_DISTANCE_PX) latest.current.onSwipeLeft?.();
      else if (g.dx > SWIPE_DISTANCE_PX) latest.current.onSwipeRight?.();
    }
  }).panHandlers, [latest]);
}
