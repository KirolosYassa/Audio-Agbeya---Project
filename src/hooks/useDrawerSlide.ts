import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

const SLIDE_MS = 220;

/** Slides a drawer in from the right and out again. `mounted` stays true until the closing animation has finished;
    `offset` is the horizontal distance still to travel (0 = fully open, `width` = fully hidden). */
export function useDrawerSlide(open: boolean, width: number) {
  const [offset] = useState(() => new Animated.Value(width));
  const [mounted, setMounted] = useState(false);

  // mount as soon as the drawer is asked to open, so it exists before the opening animation starts
  if (open && !mounted) setMounted(true);

  useEffect(() => {
    if (open) {
      Animated.timing(offset, { toValue: 0, duration: SLIDE_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
      return;
    }
    Animated.timing(offset, { toValue: width, duration: SLIDE_MS, easing: Easing.in(Easing.cubic), useNativeDriver: true })
      .start(({ finished }) => { if (finished) setMounted(false); });
  }, [open, offset, width]);

  return { mounted, offset };
}
