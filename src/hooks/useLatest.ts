import { useLayoutEffect, useRef } from 'react';

/** A ref that holds the value from the latest committed render, for timers and cleanups that must not capture stale values. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useLayoutEffect(() => { ref.current = value; });
  return ref;
}
