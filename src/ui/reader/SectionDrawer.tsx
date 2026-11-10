/* The list of sections that slides in from the right. Tap a section to jump there. Closes with the X, a tap
   outside, a swipe to the left-to-right, or the Android Back button. */
import React from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime } from '../../core/formatTime';
import { navStartTime } from '../../core/playback/blocks';
import type { Block, NavEntry } from '../../core/types';
import { useDrawerSlide } from '../../hooks/useDrawerSlide';
import { useHardwareBack } from '../../hooks/useHardwareBack';
import { useHorizontalSwipe } from '../../hooks/useHorizontalSwipe';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

const MAX_DRAWER_WIDTH = 380;
const DRAWER_WIDTH_FRACTION = 0.86;

interface Props { open: boolean; title: string; nav: NavEntry[]; blocks: Block[]; activeNav: number; onSelect(entry: NavEntry): void; onClose(): void }

function DrawerHeader({ title, onClose }: { title: string; onClose(): void }) {
  const theme = useTheme();
  return (
    <View style={[styles.header, { backgroundColor: theme.navy }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: theme.onNavy }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.hint, { color: theme.onNavy }]}>اضغط على أي قسم للانتقال إليه</Text>
      </View>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="إغلاق" style={styles.close}><Icon name="close" size={24} color={theme.onNavy} /></Pressable>
    </View>
  );
}

function DrawerItem({ entry, startTime, active, onPress }: { entry: NavEntry; startTime: number; active: boolean; onPress(): void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={[styles.item, { borderColor: theme.line, backgroundColor: active ? theme.maroon : 'transparent' }]}>
      <Text style={[styles.itemName, { color: active ? theme.cream : theme.head }]}>{entry[0]}</Text>
      <Text style={[styles.itemTime, { color: active ? theme.cream : theme.inkDim }]}>{formatTime(startTime)}</Text>
    </Pressable>
  );
}

export function SectionDrawer({ open, title, nav, blocks, activeNav, onSelect, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerWidth = Math.min(Math.round(width * DRAWER_WIDTH_FRACTION), MAX_DRAWER_WIDTH);
  const { mounted, offset } = useDrawerSlide(open, drawerWidth);
  const swipeHandlers = useHorizontalSwipe({ onSwipeRight: onClose });
  useHardwareBack(open, onClose);

  if (!mounted) return null;
  const backdropOpacity = offset.interpolate({ inputRange: [0, drawerWidth], outputRange: [1, 0], extrapolate: 'clamp' });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)', opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="إغلاق" />
      </Animated.View>
      <Animated.View {...swipeHandlers} accessibilityViewIsModal
        style={[styles.drawer, { width: drawerWidth, backgroundColor: theme.panel, borderColor: theme.line, paddingTop: insets.top, transform: [{ translateX: offset }] }]}>
        <DrawerHeader title={title} onClose={onClose} />
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
          {nav.map((entry, i) => (
            <DrawerItem key={i} entry={entry} startTime={navStartTime(blocks, entry)} active={i === activeNav} onPress={() => onSelect(entry)} />
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: { position: 'absolute', top: 0, bottom: 0, right: 0, borderLeftWidth: 1, elevation: 16 },
  header: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12 },
  title: { fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  hint: { fontFamily: FONTS.text, fontSize: 14, opacity: 0.85, textAlign: 'right', writingDirection: 'rtl' },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  itemName: { fontFamily: FONTS.textBold, fontSize: 22, lineHeight: 32, textAlign: 'right', writingDirection: 'rtl' },
  itemTime: { fontFamily: FONTS.uiBold, fontSize: 13 }
});
