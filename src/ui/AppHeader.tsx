/* The navy band at the top of every screen: back button, title + subtitle, and (in the reader) the text-size
   buttons. The theme button is always there. Laid out right-to-left by hand so it does not depend on the phone's language. */
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../state/settings';
import { Icon } from './Icon';
import { FONTS, FONT_SIZES, useTheme } from './theme';

interface Props { title: string; sub: string; big?: boolean; onBack?: () => void; showFontButtons?: boolean }

export function AppHeader({ title, sub, big, onBack, showFontButtons }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { fontIndex, changeFont, toggleTheme } = useSettings();
  return (
    <View style={[styles.band, { backgroundColor: theme.navy, paddingTop: insets.top }]}>
      <View style={styles.row}>
        {onBack ? (
          <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="الرجوع" style={styles.ib} hitSlop={6}>
            <Icon name="back" size={26} color={theme.onNavy} />
          </Pressable>
        ) : null}
        <View style={[styles.titles, big && styles.titlesBig]}>
          <Text style={[styles.title, big && styles.titleBig, { color: theme.onNavy }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.sub, { color: theme.onNavy }]} numberOfLines={1}>{sub}</Text>
        </View>
        <View style={styles.tools}>
          {showFontButtons ? (
            <>
              <Pressable onPress={() => changeFont(-1)} disabled={fontIndex === 0} accessibilityLabel="تصغير الخط" style={[styles.ib, fontIndex === 0 && styles.off]}>
                <Text style={[styles.tlb, { color: theme.onNavy }]}>A−</Text>
              </Pressable>
              <Pressable onPress={() => changeFont(1)} disabled={fontIndex === FONT_SIZES.length - 1} accessibilityLabel="تكبير الخط" style={[styles.ib, fontIndex === FONT_SIZES.length - 1 && styles.off]}>
                <Text style={[styles.tlb, { color: theme.onNavy }]}>A+</Text>
              </Pressable>
            </>
          ) : null}
          <Pressable onPress={toggleTheme} accessibilityLabel="تبديل المظهر (ورقي / ليلي)" style={styles.ib}>
            <Icon name="moon" size={24} color={theme.onNavy} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { paddingHorizontal: 12 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', minHeight: 58, gap: 8 },
  ib: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  off: { opacity: 0.35 },
  titles: { flex: 1, paddingVertical: 8 },
  titlesBig: { paddingVertical: 18 },
  title: { fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  titleBig: { fontSize: 33, lineHeight: 46 },
  sub: { fontFamily: FONTS.ui, fontSize: 14, opacity: 0.85, textAlign: 'right' },
  tools: { flexDirection: 'row', alignItems: 'center' },
  tlb: { fontFamily: FONTS.uiBold, fontSize: 15 }
});
