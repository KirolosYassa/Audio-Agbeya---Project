import assert from 'node:assert/strict';
import { test } from 'node:test';
import { copticMonthLength, copticToJd, jdToCoptic } from '../src/core/calendar/coptic';
import { formatDay } from '../src/core/calendar/format';
import { gregorianToJd, jdToGregorian } from '../src/core/calendar/gregorian';
import { monthCells, moveMonth } from '../src/core/calendar/month';
import { otherRangeLabel } from '../src/core/calendar/rangeLabel';
import { weekdayOfJd } from '../src/core/calendar/week';

const cop = (y: number, m: number, dd: number) => jdToCoptic(gregorianToJd(y, m, dd));

test('known Coptic dates', () => {
  assert.deepEqual(cop(2026, 10, 24), { year: 1743, month: 2, day: 14 });
  assert.deepEqual(cop(2026, 9, 11), { year: 1743, month: 1, day: 1 });
  assert.deepEqual(cop(2026, 9, 10), { year: 1742, month: 13, day: 5 });
  assert.deepEqual(cop(2023, 9, 12), { year: 1740, month: 1, day: 1 });
  assert.deepEqual(cop(2023, 9, 11), { year: 1739, month: 13, day: 6 });
  assert.deepEqual(cop(2024, 1, 7), { year: 1740, month: 4, day: 28 });
  assert.deepEqual(cop(2024, 1, 8), { year: 1740, month: 4, day: 29 });
  assert.deepEqual(cop(2025, 1, 7), { year: 1741, month: 4, day: 29 });
  assert.deepEqual(cop(2026, 1, 7), { year: 1742, month: 4, day: 29 });
  assert.deepEqual(cop(2027, 9, 12), { year: 1744, month: 1, day: 1 });
  assert.deepEqual(cop(2028, 3, 1), { year: 1744, month: 6, day: 22 });
});

test('weekdays', () => {
  assert.equal(weekdayOfJd(gregorianToJd(2026, 10, 24)), 6);
  assert.equal(weekdayOfJd(gregorianToJd(2000, 1, 1)), 6);
  assert.equal(weekdayOfJd(gregorianToJd(2026, 10, 1)), 4);
});

test('round trips over 70 years', () => {
  let bad = 0;
  for (let jd = gregorianToJd(1990, 1, 1); jd < gregorianToJd(2060, 1, 1); jd++) {
    const g = jdToGregorian(jd), c = jdToCoptic(jd);
    if (gregorianToJd(g.year, g.month, g.day) !== jd || copticToJd(c.year, c.month, c.day) !== jd || c.day < 1 || c.day > copticMonthLength(c.year, c.month)) bad++;
  }
  assert.equal(bad, 0);
});

test('month navigation and grid', () => {
  assert.deepEqual(moveMonth('coptic', { year: 1743, month: 1 }, -1), { year: 1742, month: 13 });
  assert.deepEqual(moveMonth('gregorian', { year: 2026, month: 12 }, 1), { year: 2027, month: 1 });
  assert.equal(monthCells('gregorian', { year: 2026, month: 10 }).length, 31 + 5);
  assert.equal(otherRangeLabel('coptic', { year: 1743, month: 2 }), 'أكتوبر – نوفمبر ٢٠٢٦');
  assert.equal(formatDay('coptic', gregorianToJd(2026, 10, 24)), '١٤ بابه ١٧٤٣');
});
