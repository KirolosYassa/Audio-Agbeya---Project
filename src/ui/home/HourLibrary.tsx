/* The framed library box: the grid of hours and the note under it. */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hasContent } from '../../data/content';
import { HOURS } from '../../data/hours';
import { useLibraryActions } from '../../hooks/useLibraryActions';
import { useLibraryTileSize } from '../../hooks/useLibraryTileSize';
import { useDownloads } from '../../state/downloads';
import { FONTS, useTheme } from '../theme';
import { HourTile } from './HourTile';
import { LibraryNote } from './LibraryNote';

export function HourLibrary() {
  const theme = useTheme();
  const downloads = useDownloads();
  const tileSize = useLibraryTileSize();
  const { open, askRemove } = useLibraryActions();
  return (
    <View style={[styles.lib, { borderColor: theme.line }]}>
      <Text style={[styles.title, { color: theme.head, borderColor: theme.line }]}>الأجبية</Text>
      <View style={styles.grid}>
        {HOURS.map(hour => (
          <HourTile key={hour.id} hour={hour} ready={hasContent(hour.id)} download={downloads.of(hour.id)} size={tileSize}
            onPress={() => open(hour)} onLongPress={() => askRemove(hour)} />
        ))}
      </View>
      <LibraryNote />
    </View>
  );
}

const styles = StyleSheet.create({
  lib: { borderWidth: 1, padding: 12, paddingBottom: 20 },
  title: { fontFamily: FONTS.text, fontSize: 34, textAlign: 'right', paddingBottom: 8, marginBottom: 12, borderBottomWidth: 1 },
  grid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'flex-start' }
});
