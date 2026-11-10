/* Reader: one hour with its prayer text, the audio player and the section drawer. */
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { blockIndexAt, navIndexOf, navStartTime } from '../../core/playback';
import type { Block, HourData, NavEntry } from '../../core/types';
import { getHourData, recordingSeconds } from '../../data/hours';
import { localUri } from '../../services/downloads';
import { useHourPlayer } from '../../services/useHourPlayer';
import { useDownloads } from '../../state/downloads';
import { useSettings } from '../../state/settings';
import { AppHeader } from '../../ui/AppHeader';
import { useToast } from '../../ui/Toast';
import { DownloadPanel } from '../../ui/reader/DownloadPanel';
import { PlayerDock } from '../../ui/reader/PlayerDock';
import { ReaderSheet, type ReaderSheetHandle } from '../../ui/reader/ReaderSheet';
import { SectionDrawer } from '../../ui/reader/SectionDrawer';
import { SpeedPopover } from '../../ui/reader/SpeedPopover';
import { FONTS, useTheme } from '../../ui/theme';

const OPEN_SWIPE_PX = 70;
const DOCK_HEIGHT_GUESS = 178;

export default function HourScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = getHourData(String(id));
  const theme = useTheme();
  if (!data) {
    return <View style={{ flex: 1, backgroundColor: theme.page }}><AppHeader title="الأجبية" sub="" onBack={() => router.back()} /><Text style={{ color: theme.ink, padding: 24, textAlign: 'right' }}>هذه الساعة غير متاحة بعد.</Text></View>;
  }
  return <Reader hourId={String(id)} data={data} />;
}

function Reader({ hourId, data }: { hourId: string; data: HourData }) {
  const theme = useTheme();
  const toast = useToast();
  const { fontIndex, rate, setRate } = useSettings();
  const downloads = useDownloads();
  const download = downloads.of(hourId);
  const uri = download.status === 'ready' ? localUri(hourId) : null;
  const player = useHourPlayer({ hourId, data, uri, rate });

  const sheet = useRef<ReaderSheetHandle>(null);
  const [follow, setFollow] = useState(true);
  const [offscreen, setOffscreen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  const audioOn = uri !== null;
  const activeBlock = audioOn && player.ready ? blockIndexAt(data.blocks, player.time) : -1;
  const activeNav = activeBlock >= 0 ? navIndexOf(data.nav, activeBlock) : -1;
  const sectionName = data.nav[Math.max(activeNav, 0)][0];

  const resumeFollowing = useCallback(() => { setFollow(true); setOffscreen(false); }, []);
  const jumpTo = (time: number, index: number, thenPlay: boolean) => { resumeFollowing(); sheet.current?.expandFor(index); player.seekTo(time + 0.01, thenPlay); };

  const onBlockPress = (block: Block, index: number) => {
    if (!audioOn || !player.ready) return toast('حمّل الصوت أولاً لتشغيل هذا المقطع.');
    jumpTo(block.s, index, true);
  };
  const onSelectNav = (entry: NavEntry) => { setDrawerOpen(false); if (audioOn && player.ready) jumpTo(navStartTime(data.blocks, entry), entry[1] - 1, false); else sheet.current?.scrollToBlock(entry[1] - 1); };
  const goToCurrent = () => { resumeFollowing(); if (activeBlock >= 0) sheet.current?.scrollToBlock(activeBlock); };

  const startDownload = () => downloads.start(hourId).catch(error => Alert.alert('تعذّر تحميل الصوت', error instanceof Error && error.name === 'Error' && error.message.includes('EXPO_PUBLIC') ? 'رابط الصوت غير مضبوط في التطبيق بعد.' : 'تأكد من الاتصال بالإنترنت وحاول مرة أخرى.'));
  const pickSpeed = (value: number) => { setRate(value); setSpeedOpen(false); };

  // swipe from right to left anywhere on the text opens the section list
  const swipe = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponderCapture: (_, g) => Math.abs(g.dx) > 20 && Math.abs(g.dx) > 1.6 * Math.abs(g.dy),
    onPanResponderRelease: (_, g) => { if (g.dx < -OPEN_SWIPE_PX) setDrawerOpen(true); }
  }), []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title={data.title} sub={data.sub} onBack={() => router.back()} showFontButtons />
      <View style={{ flex: 1 }} {...swipe.panHandlers}>
        <ReaderSheet blocks={data.blocks} activeBlock={activeBlock} fontIndex={fontIndex} follow={follow} handleRef={sheet}
          onUserScroll={() => { setFollow(false); setSpeedOpen(false); }} onBlockPress={onBlockPress} onActiveOffscreen={setOffscreen} />
        {!follow && offscreen && activeBlock >= 0 ? (
          <Pressable onPress={goToCurrent} style={[styles.now, { backgroundColor: theme.navyDeep }]}><Text style={[styles.nowText, { color: theme.cream }]}>العودة إلى المقطع الحالي</Text></Pressable>
        ) : null}
      </View>
      {audioOn ? (
        <PlayerDock player={player} rate={rate} sectionName={sectionName} speedOpen={speedOpen} onFollow={resumeFollowing}
          onOpenSections={() => { setSpeedOpen(false); setDrawerOpen(true); }} onToggleSpeed={() => setSpeedOpen(open => !open)} />
      ) : (
        <DownloadPanel download={download} seconds={recordingSeconds(data)} onStart={startDownload} onCancel={() => downloads.cancel(hourId)} />
      )}
      {speedOpen ? <SpeedPopover rate={rate} bottom={DOCK_HEIGHT_GUESS} onPick={pickSpeed} /> : null}
      <SectionDrawer open={drawerOpen} title={data.title} nav={data.nav} blocks={data.blocks} activeNav={activeNav} onSelect={onSelectNav} onClose={() => setDrawerOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  now: { position: 'absolute', alignSelf: 'center', bottom: 14, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999, elevation: 6 },
  nowText: { fontFamily: FONTS.textBold, fontSize: 17 }
});
