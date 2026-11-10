import { useCallback, useState } from 'react';

/** "Following" = the text scrolls by itself to the playing block. Scrolling by hand stops it until the person resumes. */
export function useFollowMode() {
  const [follow, setFollow] = useState(true);
  const [activeOffscreen, setActiveOffscreen] = useState(false);

  const resume = useCallback(() => { setFollow(true); setActiveOffscreen(false); }, []);
  const stop = useCallback(() => setFollow(false), []);

  return { follow, activeOffscreen, setActiveOffscreen, resume, stop };
}
