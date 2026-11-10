import assert from 'node:assert/strict';
import { test } from 'node:test';
import { gregorianToJd as J, jdToGregorian } from '../src/core/calendar/gregorian';
import { orthodoxEasterJd } from '../src/core/feasts/easter';
import { eventsOn } from '../src/core/feasts/events';

const ymd = (jd: number) => { const g = jdToGregorian(jd); return `${g.year}-${String(g.month).padStart(2, '0')}-${String(g.day).padStart(2, '0')}`; };
const names = (y: number, m: number, d: number) => eventsOn(J(y, m, d)).map(e => e.name + (e.edge ? `[${e.edge}]` : ''));
const has = (y: number, m: number, d: number, text: string) => assert.ok(names(y, m, d).some(x => x.includes(text)), `${y}-${m}-${d} should have "${text}", got ${names(y, m, d)}`);
const hasNot = (y: number, m: number, d: number, text: string) => assert.ok(!names(y, m, d).some(x => x.includes(text)), `${y}-${m}-${d} should not have "${text}"`);

test('Orthodox Easter dates', () => {
  for (const [y, w] of [[2018, '2018-04-08'], [2019, '2019-04-28'], [2024, '2024-05-05'], [2025, '2025-04-20'], [2026, '2026-04-12'], [2027, '2027-05-02'], [2028, '2028-04-16'], [2029, '2029-04-08'], [2030, '2030-04-28']] as const)
    assert.equal(ymd(orthodoxEasterJd(y)), w);
});

test('2026 feasts', () => {
  for (const [m, d, t] of [[1, 7, 'الميلاد'], [1, 19, 'الغطاس'], [1, 14, 'الختان'], [1, 21, 'قانا'], [2, 15, 'الهيكل'], [4, 7, 'البشارة'], [4, 5, 'الشعانين'], [4, 9, 'خميس العهد'], [4, 10, 'الجمعة العظيمة'], [4, 12, 'القيامة'],
    [4, 19, 'توما'], [5, 21, 'الصعود'], [5, 31, 'العنصرة'], [6, 1, 'أرض مصر'], [7, 12, 'الرسل (بطرس'], [8, 19, 'التجلي'], [8, 22, 'صعود جسد'], [9, 11, 'النيروز'], [9, 27, 'عيد الصليب']] as const) has(2026, m, d, t);
});

test('2026 fasts and their edges', () => {
  has(2026, 2, 2, 'صوم نينوى (يونان)[start]'); has(2026, 2, 4, 'نينوى (يونان)[end]'); hasNot(2026, 2, 5, 'نينوى');
  has(2026, 2, 16, 'الصوم الكبير[start]'); has(2026, 4, 11, 'الصوم الكبير[end]'); hasNot(2026, 4, 12, 'الصوم الكبير');
  has(2026, 6, 1, 'صوم الرسل[start]'); has(2026, 7, 11, 'صوم الرسل[end]'); hasNot(2026, 7, 12, 'صوم الرسل');
  has(2026, 8, 7, 'صوم السيدة العذراء[start]'); has(2026, 8, 21, 'العذراء[end]');
  has(2026, 11, 25, 'صوم الميلاد[start]'); has(2027, 1, 6, 'صوم الميلاد[end]'); has(2027, 1, 1, 'صوم الميلاد');
});

test('2025 and 2027 reference dates', () => {
  for (const [y, m, d, t] of [[2025, 2, 24, 'الصوم الكبير[start]'], [2025, 2, 10, 'نينوى (يونان)[start]'], [2025, 4, 20, 'القيامة'], [2025, 5, 29, 'الصعود'], [2025, 6, 8, 'العنصرة'], [2025, 4, 13, 'الشعانين'],
    [2025, 11, 25, 'صوم الميلاد[start]'], [2025, 8, 7, 'العذراء[start]'], [2025, 8, 22, 'صعود جسد'], [2025, 7, 12, 'الرسل (بطرس'], [2027, 5, 2, 'القيامة'], [2027, 3, 8, 'الصوم الكبير[start]'], [2027, 6, 21, 'صوم الرسل[start]']] as const) has(y, m, d, t);
});

test('weekly fast rules', () => {
  hasNot(2026, 4, 15, 'صوم الأربعاء'); hasNot(2026, 5, 22, 'صوم الجمعة');
  has(2026, 10, 28, 'صوم الأربعاء'); has(2026, 10, 30, 'صوم الجمعة');
  hasNot(2026, 2, 18, 'صوم الأربعاء');
});

test('Apostles fast starts the day after Pentecost every year 2000-2100', () => {
  let bad = 0;
  for (let y = 2000; y <= 2100; y++) {
    const e = orthodoxEasterJd(y);
    const first = eventsOn(e + 50).some(x => x.edge === 'start' && x.name === 'صوم الرسل');
    const g = jdToGregorian(e).month;
    if (!first || g < 3 || g > 5) bad++;
  }
  assert.equal(bad, 0);
});
