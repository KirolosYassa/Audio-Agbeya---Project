/* Credits and the "download once, then offline" note at the bottom of the library. */
import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import { FONTS, useTheme } from '../theme';

const ST_TAKLA = 'https://st-takla.org/Agpeya/Agbeya_01_Prime_.html';

export function LibraryNote() {
  const theme = useTheme();
  return (
    <Text style={[styles.note, { color: theme.inkDim }]}>
      النص: <Text style={{ color: theme.head, textDecorationLine: 'underline' }} onPress={() => Linking.openURL(ST_TAKLA)}>موقع كنيسة الأنبا تكلاهيمانوت – st-takla.org</Text> (مع تعديل بعض الألفاظ لتطابق التسجيل).
      {'\n'}التسجيل: كورال شباب الأنبا رويس – قناة مي سات (بحسب اسم الملف). الصوت يُحمَّل مرة واحدة لكل ساعة ثم يعمل بدون إنترنت. اضغط مطولاً على ساعة محمّلة لحذف صوتها.
    </Text>
  );
}

const styles = StyleSheet.create({
  note: { marginTop: 18, fontFamily: FONTS.text, fontSize: 15, lineHeight: 28, textAlign: 'right', writingDirection: 'rtl' }
});
