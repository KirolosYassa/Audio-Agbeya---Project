/* The list of sections that slides in from the right. Tap a section to jump there. Closes with the X, a tap
   outside, a swipe to the left-to-right, or the Android Back button. */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, BackHandler, Easing, PanResponder, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTime, navStartTime } from '../../core/playback';
import type { Block, NavEntry } from '../../core/types';
import { Icon } from '../Icon';
import { FONTS, useTheme } from '../theme';

const SLIDE_MS = 220;
const CLOSE_SWIPE_PX = 70;

interface Props { open: boolean; title: string; nav: NavEntry[]; blocks: Block[]; activeNav: number; onSelect(entry: NavEntry): void; onClose(): void }

export function SectionDrawer({ open, title, nav, blocks, activeNav, onSelect, onClose }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const drawerW = Math.min(Math.round(width * 0.86), 380);
  const slide = useRef(new Animated.Value(drawerW)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) { setMounted(true); Animated.timing(slide, { toValue: 0, duration: SLIDE_MS, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); return; }
    Animated.timing(slide, { toValue: drawerW, duration: SLIDE_MS, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(({ finished }) => { if (finished) setMounted(false); });
  }, [open, slide, drawerW]);

  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onClose(); return true; });
    return () => sub.remove();
  }, [open, onClose]);

  const swipe = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > 1.6 * Math.abs(g.dy),
    onPanResponderRelease: (_, g) => { if (g.dx > CLOSE_SWIPE_PX) onClose(); }
  }), [onClose]);

  if (!mounted) return null;
  const opacity = slide.interpolate({ inputRange: [0, drawerW], outputRange: [1, 0], extrapolate: 'clamp' });
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.45)', opacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} accessibilityLabel="إغلاق" />
      </Animated.View>
      <Animated.View {...swipe.panHandlers} accessibilityViewIsModal style={[styles.drawer, { width: drawerW, backgroundColor: theme.panel, borderColor: theme.line, paddingTop: insets.top, transform: [{ translateX: slide }] }]}>
        <View style={[styles.dh, { backgroundColor: theme.navy }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.t1, { color: theme.onNavy }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.t2, { color: theme.onNavy }]}>اضغط على أي قسم للانتقال إليه</Text>
          </View>
          <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="إغلاق" style={styles.close}><Icon name="close" size={24} color={theme.onNavy} /></Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
          {nav.map((entry, i) => (
            <Pressable key={i} onPress={() => onSelect(entry)} accessibilityRole="button" accessibilityState={{ selected: i === activeNav }}
              style={[styles.item, { borderColor: theme.line, backgroundColor: i === activeNav ? theme.maroon : 'transparent' }]}>
              <Text style={[styles.dn, { color: i === activeNav ? theme.cream : theme.head }]}>{entry[0]}</Text>
              <Text style={[styles.dtm, { color: i === activeNav ? theme.cream : theme.inkDim }]}>{formatTime(navStartTime(blocks, entry))}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: { position: 'absolute', top: 0, bottom: 0, right: 0, borderLeftWidth: 1, elevation: 16 },
  dh: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12 },
  t1: { fontFamily: FONTS.textBold, fontSize: 24, lineHeight: 34, textAlign: 'right', writingDirection: 'rtl' },
  t2: { fontFamily: FONTS.text, fontSize: 14, opacity: 0.85, textAlign: 'right', writingDirection: 'rtl' },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  item: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  dn: { fontFamily: FONTS.textBold, fontSize: 22, lineHeight: 32, textAlign: 'right', writingDirection: 'rtl' },
  dtm: { fontFamily: FONTS.uiBold, fontSize: 13 }
});
