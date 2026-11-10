import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/** While `active`, the Android Back button calls `onBack` instead of leaving the screen. */
export function useHardwareBack(active: boolean, onBack: () => void): void {
  useEffect(() => {
    if (!active) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { onBack(); return true; });
    return () => subscription.remove();
  }, [active, onBack]);
}
