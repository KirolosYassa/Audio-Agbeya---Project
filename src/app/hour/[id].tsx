/* Route /hour/<id>: the reader for one hour. */
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { getHourData } from '../../data/content';
import { HourUnavailableScreen } from '../../screens/HourUnavailableScreen';
import { ReaderScreen } from '../../screens/ReaderScreen';

export default function HourRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const hourId = String(id);
  const data = getHourData(hourId);
  return data ? <ReaderScreen hourId={hourId} data={data} /> : <HourUnavailableScreen />;
}
