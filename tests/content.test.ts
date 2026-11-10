import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HourData } from '../src/core/types';
import { formatTime } from '../src/core/formatTime';
import { blockIndexAt, navIndexOf } from '../src/core/playback/blocks';
import { shouldRestore } from '../src/core/playback/resume';
import { nextTarget, previousTarget } from '../src/core/playback/seek';

const IDS = ['prime', 'terce', 'sext', 'none', 'vespers', 'compline', 'mid1', 'mid2', 'mid3'];
const load = (id: string): HourData => JSON.parse(readFileSync(join(__dirname, '../src/data/content', id + '.json'), 'utf8'));

test('every hour: blocks are timed in order and nav covers valid, ordered block ranges', () => {
  for (const id of IDS) {
    const { blocks, nav } = load(id);
    assert.ok(blocks.length > 5, id);
    blocks.forEach((b, i) => {
      assert.ok(b.e > b.s, `${id} block ${i + 1} ends after it starts`);
      if (i > 0) assert.ok(b.s >= blocks[i - 1].s, `${id} block ${i + 1} starts after the previous`);
      assert.ok(b.x.length > 0 && b.t.length > 0, `${id} block ${i + 1} has text and title`);
    });
    let prevLast = 0;
    for (const [label, first, last] of nav) {
      assert.ok(label.length > 0 && first >= 1 && last >= first && last <= blocks.length, `${id} nav ${label} range`);
      assert.ok(first > prevLast, `${id} nav ${label} follows the previous entry`);
      prevLast = last;
    }
    assert.equal(nav[0][1], 1, `${id} nav starts at block 1`);
  }
});

test('blockIndexAt finds the right block at every block start and in the middle', () => {
  for (const id of IDS) {
    const { blocks } = load(id);
    blocks.forEach((b, i) => {
      assert.equal(blockIndexAt(blocks, b.s), i, `${id} start of ${i + 1}`);
      assert.equal(blockIndexAt(blocks, (b.s + b.e) / 2 - 0.0001 > b.s ? (b.s + b.e) / 2 : b.s), i, `${id} middle of ${i + 1}`);
    });
  }
});

test('navIndexOf maps blocks to sections', () => {
  const { nav } = load('prime');
  assert.equal(navIndexOf(nav, 0), 0);
  assert.equal(nav[navIndexOf(nav, 34)][0], 'الإنجيل'); // block 35
  assert.equal(nav[navIndexOf(nav, 71)][0], 'الذكصولوجية'); // block 72
});

test('previous / next targets', () => {
  const { blocks } = load('terce');
  const mid = blocks[5].s + 10;
  assert.ok(Math.abs(previousTarget(blocks, mid) - (blocks[5].s + 0.01)) < 1e-9); // far into the block: restart it
  assert.ok(Math.abs(previousTarget(blocks, blocks[5].s + 1) - (blocks[4].s + 0.01)) < 1e-9); // just started: go back
  assert.ok(Math.abs((nextTarget(blocks, mid) as number) - (blocks[6].s + 0.01)) < 1e-9);
  assert.equal(nextTarget(blocks, blocks[blocks.length - 1].s + 1), null);
});

test('formatTime and shouldRestore', () => {
  assert.equal(formatTime(0), '0:00');
  assert.equal(formatTime(65.9), '1:05');
  assert.equal(formatTime(3725), '1:02:05');
  assert.equal(shouldRestore(undefined, 100), false);
  assert.equal(shouldRestore(0.5, 100), false);
  assert.equal(shouldRestore(50, 100), true);
  assert.equal(shouldRestore(98, 100), false);
});
