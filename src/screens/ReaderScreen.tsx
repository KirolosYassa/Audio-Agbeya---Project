/* Reader: one hour with its prayer text, the audio player and the section drawer. */
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import { recordingSeconds } from '../core/hours';
import { activePositionAt, navLabel, navStartTime } from '../core/playback/blocks';
import { SEEK_NUDGE } from '../core/playback/seek';
import type { Block, HourData, NavEntry } from '../core/types';
import { useFollowMode } from '../hooks/reader/useFollowMode';
import { useHorizontalSwipe } from '../hooks/useHorizontalSwipe';
import { useHourPlayer } from '../hooks/player/useHourPlayer';
import { localUri } from '../services/audioFiles';
import { useDownloads } from '../state/downloads';
import { useSettings } from '../state/settings';
import { AppHeader } from '../ui/header/AppHeader';
import { useToast } from '../ui/Toast';
import { BackToCurrentPill } from '../ui/reader/BackToCurrentPill';
import { DownloadPanel } from '../ui/reader/DownloadPanel';
import { alertDownloadFailure } from '../ui/reader/downloadFailure';
import { PlayerDock } from '../ui/reader/PlayerDock';
import { ReaderSheet, type ReaderSheetHandle } from '../ui/reader/ReaderSheet';
import { SectionDrawer } from '../ui/reader/SectionDrawer';
import { SpeedPopover } from '../ui/reader/SpeedPopover';
import { useTheme } from '../ui/theme';

/** Where the speed picker sits: just above the player dock. */
const DOCK_HEIGHT_GUESS = 178;

export function ReaderScreen({ hourId, data }: { hourId: string; data: HourData }) {
  const theme = useTheme();
  const toast = useToast();
  const { fontIndex, rate, setRate } = useSettings();
  const downloads = useDownloads();
  const download = downloads.of(hourId);
  const uri = download.status === 'ready' ? localUri(hourId) : null;
  const audioOn = uri !== null;
  const player = useHourPlayer({ hourId, data, uri, rate });

  const sheet = useRef<ReaderSheetHandle>(null);
  const follow = useFollowMode();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [speedOpen, setSpeedOpen] = useState(false);

  const audioReady = audioOn && player.ready;
  const active = activePositionAt(data, audioReady ? player.time : null);

  // ----- actions
  const jumpTo = (time: number, blockIndex: number, thenPlay: boolean) => {
    follow.resume();
    sheet.current?.expandFor(blockIndex);
    player.seekTo(time + SEEK_NUDGE, thenPlay);
  };

  const playBlock = (block: Block, blockIndex: number) => {
    if (!audioReady) return toast('حمّل الصوت أولاً لتشغيل هذا المقطع.');
    jumpTo(block.s, blockIndex, true);
  };

  const goToSection = (entry: NavEntry) => {
    setDrawerOpen(false);
    const firstBlock = entry[1] - 1;
    if (audioReady) jumpTo(navStartTime(data.blocks, entry), firstBlock, false);
    else sheet.current?.scrollToBlock(firstBlock);
  };

  const goToCurrentBlock = () => {
    follow.resume();
    if (active.block >= 0) sheet.current?.scrollToBlock(active.block);
  };

  const onUserScroll = () => { follow.stop(); setSpeedOpen(false); };
  const openSections = () => { setSpeedOpen(false); setDrawerOpen(true); };
  const closeSections = () => setDrawerOpen(false);
  const toggleSpeed = () => setSpeedOpen(open => !open);
  const pickSpeed = (value: number) => { setRate(value); setSpeedOpen(false); };
  const startDownload = () => downloads.start(hourId).catch(alertDownloadFailure);

  // swipe from right to left anywhere on the text opens the section list
  const swipeHandlers = useHorizontalSwipe({ onSwipeLeft: openSections });

  return (
    <View style={{ flex: 1, backgroundColor: theme.page }}>
      <AppHeader title={data.title} sub={data.sub} onBack={() => router.back()} showFontButtons />
      <View style={{ flex: 1 }} {...swipeHandlers}>
        <ReaderSheet blocks={data.blocks} activeBlock={active.block} fontIndex={fontIndex} follow={follow.follow} handleRef={sheet}
          onUserScroll={onUserScroll} onBlockPress={playBlock} onActiveOffscreen={follow.setActiveOffscreen} />
        {!follow.follow && follow.activeOffscreen && active.block >= 0 ? <BackToCurrentPill onPress={goToCurrentBlock} /> : null}
      </View>
      {audioOn ? (
        <PlayerDock player={player} rate={rate} sectionName={navLabel(data.nav, active.nav)} speedOpen={speedOpen}
          onFollow={follow.resume} onOpenSections={openSections} onToggleSpeed={toggleSpeed} />
      ) : (
        <DownloadPanel download={download} seconds={recordingSeconds(data)} onStart={startDownload} onCancel={() => downloads.cancel(hourId)} />
      )}
      {speedOpen ? <SpeedPopover rate={rate} bottom={DOCK_HEIGHT_GUESS} onPick={pickSpeed} /> : null}
      <SectionDrawer open={drawerOpen} title={data.title} nav={data.nav} blocks={data.blocks} activeNav={active.nav} onSelect={goToSection} onClose={closeSections} />
    </View>
  );
}
