import React from 'react';
import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { FONTS, useTheme } from '../theme';

function Swatch({ label, box }: { label: string; box: ViewStyle }) {
  const theme = useTheme();
  return <View style={styles.swatchRow}><View style={[styles.swatch, box]} /><Text style={[styles.text, { color: theme.inkDim }]}>{label}</Text></View>;
}

/** Explains the colours of the month grid. */
export function Legend() {
  const theme = useTheme();
  return (
    <View style={styles.legend}>
      <Swatch label="عيد سيدي كبير" box={{ backgroundColor: theme.maroon }} />
      <Swatch label="عيد" box={{ borderWidth: 1.5, borderColor: theme.accent }} />
      <Swatch label="صوم" box={{ height: 4, marginTop: 6, backgroundColor: theme.head }} />
    </View>
  );
}

const styles = StyleSheet.create({
  legend: { marginTop: 10, flexDirection: 'row-reverse', gap: 18 },
  swatchRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 3 },
  text: { fontFamily: FONTS.text, fontSize: 14 }
});
