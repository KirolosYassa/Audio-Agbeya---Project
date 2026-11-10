import { useCallback, useRef } from 'react';
import type { LayoutChangeEvent, ScrollViewInstance } from 'react-native';
import { isOutsideViewport, scrollOffsetFor, type BlockLayout } from '../../core/reader/scroll';

/** Remembers where each block was laid out and how far the scroll view is scrolled, so any block can be scrolled into view. */
export function useBlockScroller() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  const viewportHeight = useRef(0);
  const scrollY = useRef(0);
  const layouts = useRef<Record<number, BlockLayout>>({});

  const trackViewport = useCallback((event: LayoutChangeEvent) => { viewportHeight.current = event.nativeEvent.layout.height; }, []);
  const trackScrollY = useCallback((y: number) => { scrollY.current = y; }, []);
  const trackBlock = useCallback((index: number) => (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout;
    layouts.current[index] = { y, h: height };
  }, []);

  const scrollToBlock = useCallback((index: number) => {
    const layout = layouts.current[index];
    if (!layout || viewportHeight.current === 0) return;
    scrollRef.current?.scrollTo({ y: scrollOffsetFor(layout, viewportHeight.current), animated: true });
  }, []);

  const isOffscreen = useCallback((index: number): boolean => {
    const layout = layouts.current[index];
    return layout ? isOutsideViewport(layout, scrollY.current, viewportHeight.current) : false;
  }, []);

  return { scrollRef, trackViewport, trackScrollY, trackBlock, scrollToBlock, isOffscreen };
}
