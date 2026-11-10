/* Layout maths of the reader text, kept free of React so it can be tested. */
import type { Block, BlockKind } from '../types';

export interface Section { title: string; kind: BlockKind; blockIndexes: number[] }

/** Consecutive blocks with the same title form one collapsible section. */
export function groupSections(blocks: Block[]): Section[] {
  const sections: Section[] = [];
  blocks.forEach((block, index) => {
    const last = sections[sections.length - 1];
    if (last && last.title === block.t) last.blockIndexes.push(index);
    else sections.push({ title: block.t, kind: block.k, blockIndexes: [index] });
  });
  return sections;
}

/** Maps each block index to the index of the section that holds it. */
export function sectionIndexByBlock(sections: Section[]): Record<number, number> {
  const map: Record<number, number> = {};
  sections.forEach((section, sectionIndex) => section.blockIndexes.forEach(blockIndex => { map[blockIndex] = sectionIndex; }));
  return map;
}
