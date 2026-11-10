export interface BlockLayout { y: number; h: number }

const SCROLL_PAD = 16;
const TALL_BLOCK_MARGIN = 24;

/** Scroll offset that centres a block in the viewport (a block taller than the viewport is aligned to its top instead). */
export function scrollOffsetFor(layout: BlockLayout, viewportHeight: number): number {
  const y = layout.h > viewportHeight - TALL_BLOCK_MARGIN ? layout.y - SCROLL_PAD : layout.y - (viewportHeight - layout.h) / 2;
  return Math.max(0, y);
}

/** True when the block lies completely above or below the visible part of the scroll view. */
export const isOutsideViewport = (layout: BlockLayout, scrollY: number, viewportHeight: number): boolean =>
  layout.y + layout.h < scrollY || layout.y > scrollY + viewportHeight;
