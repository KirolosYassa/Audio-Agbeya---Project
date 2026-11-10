import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { MAX_FONT_INDEX } from '../../config/reader';
import { useSettings } from '../../state/settings';
import { FONTS, useTheme } from '../theme';
import { HeaderButton } from './HeaderButton';

/** "A−" and "A+": smaller and larger reading text. Each one switches off at its limit. */
export function FontSizeButtons() {
  const theme = useTheme();
  const { fontIndex, changeFont } = useSettings();
  return (
    <>
      <HeaderButton label="تصغير الخط" onPress={() => changeFont(-1)} disabled={fontIndex === 0}>
        <Text style={[styles.label, { color: theme.onNavy }]}>A−</Text>
      </HeaderButton>
      <HeaderButton label="تكبير الخط" onPress={() => changeFont(1)} disabled={fontIndex === MAX_FONT_INDEX}>
        <Text style={[styles.label, { color: theme.onNavy }]}>A+</Text>
      </HeaderButton>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: FONTS.uiBold, fontSize: 15 }
});
