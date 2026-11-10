import type { EventKind } from '../../core/feasts/types';

export const SOURCES_NOTE = 'المصادر: copticchurch.net وmvwcopts.ca وأبرشية جنوب الولايات المتحدة (قوائم الأعياد والأصوام)، وحُسبت الأعياد المتغيرة من تاريخ عيد القيامة. تُراجَع مع تقويم كنيستك.';

export const EVENT_TAGS: Record<EventKind, string> = { feast: 'عيد', fast: 'صوم', weekly: 'صوم أسبوعي', monthly: 'تذكار شهري' };
