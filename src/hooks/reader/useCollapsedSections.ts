import { useCallback, useState } from 'react';

/** Which sections of the text are folded shut. */
export function useCollapsedSections(sectionOfBlock: Record<number, number>) {
  const [closed, setClosed] = useState<Set<number>>(new Set());

  const isClosed = useCallback((sectionIndex: number) => closed.has(sectionIndex), [closed]);

  const toggle = useCallback((sectionIndex: number) => setClosed(current => {
    const next = new Set(current);
    if (next.has(sectionIndex)) next.delete(sectionIndex); else next.add(sectionIndex);
    return next;
  }), []);

  /** Opens the section that holds the block, if it is folded. */
  const expandFor = useCallback((blockIndex: number) => {
    const sectionIndex = sectionOfBlock[blockIndex];
    setClosed(current => {
      if (!current.has(sectionIndex)) return current;
      const next = new Set(current);
      next.delete(sectionIndex);
      return next;
    });
  }, [sectionOfBlock]);

  return { isClosed, toggle, expandFor };
}
