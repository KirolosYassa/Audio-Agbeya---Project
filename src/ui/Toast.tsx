/* A one-line message at the bottom of the screen that disappears by itself. */
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS, useTheme } from './theme';

const SHOW_MS = 3200;
const ToastContext = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const theme = useTheme();

  const show = useCallback((text: string) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), SHOW_MS);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {message !== null && (
        <View pointerEvents="none" style={styles.wrap}>
          <View style={[styles.box, { backgroundColor: theme.navyDeep }]}>
            <Text style={[styles.text, { color: theme.cream }]}>{message}</Text>
          </View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = (): ((message: string) => void) => useContext(ToastContext);

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, bottom: 120, alignItems: 'center' },
  box: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 12, elevation: 8 },
  text: { fontFamily: FONTS.text, fontSize: 18, textAlign: 'center', writingDirection: 'rtl' }
});
