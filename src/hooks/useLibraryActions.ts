import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import type { HourInfo } from '../core/types';
import { hasContent } from '../data/content';
import { useDownloads } from '../state/downloads';
import { useToast } from '../ui/Toast';

/** What tapping and long-pressing an hour tile does. */
export function useLibraryActions() {
  const toast = useToast();
  const downloads = useDownloads();

  /** Opens the reader, or says the hour is not ready yet. */
  const open = useCallback((hour: HourInfo) => {
    if (hasContent(hour.id)) router.push(`/hour/${hour.id}`);
    else toast(`«${hour.ar}»: النص والصوت لم يُضافا بعد.`);
  }, [toast]);

  /** Asks before deleting the downloaded audio of an hour (only for hours that have it). */
  const askRemove = useCallback((hour: HourInfo) => {
    if (downloads.of(hour.id).status !== 'ready') return;
    Alert.alert(hour.ar, 'حذف الصوت المحمّل من هذا الجهاز؟ (يبقى النص، ويمكن تحميل الصوت مرة أخرى)', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'حذف', style: 'destructive', onPress: () => downloads.remove(hour.id) }
    ]);
  }, [downloads]);

  return { open, askRemove };
}
