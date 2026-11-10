/* The navy band at the top of every screen: back button, title + subtitle, and (in the reader) the text-size
   buttons. The theme button is always there. Laid out right-to-left by hand so it does not depend on the phone's language. */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../../state/settings';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';
import { FontSizeButtons } from './FontSizeButtons';
import { HeaderButton } from './HeaderButton';

interface Props { title: string; sub: string; big?: boolean; onBack?: () => void; showFontButtons?: boolean }

export function AppHeader({ title, sub, big, onBack, showFontButtons }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { toggleTheme } = useSettings();
  return (
    <View style={[styles.band, { backgroundColor: theme.navy, paddingTop: insets.top }]}>
      <View style={styles.row}>
        {onBack ? (
          <HeaderButton label="الرجوع" onPress={onBack} hitSlop={6}><Icon name="back" size={26} color={theme.onNavy} /></HeaderButton>
        ) : null}
        <View style={[styles.titles, big && styles.titlesBig]}>
          <Text style={[styles.title, big && styles.titleBig, { color: theme.onNavy }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.sub, { color: theme.onNavy }]} numberOfLines={1}>{sub}</Text>
        </View>
        <View style={styles.tools}>
          {showFontButtons ? <FontSizeButtons /> : null}
          <HeaderButton label="تبديل المظهر (ورقي / ليلي)" onPress={toggleTheme}><Icon name="moon" size={24} color={theme.onNavy} /></HeaderButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { paddingHorizontal: 12 },
  row: { flexDirection: 'row-reverse', alignItems: 'center', minHeight: 58, gap: 8 },
  titles: { flex: 1, paddingVertical: 8 },
  titlesBig: { paddingVertical: 18 },
  title: { fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  titleBig: { fontSize: 33, lineHeight: 46 },
  sub: { fontFamily: FONTS.ui, fontSize: 14, opacity: 0.85, textAlign: 'right' },
  tools: { flexDirection: 'row', alignItems: 'center' }
});
