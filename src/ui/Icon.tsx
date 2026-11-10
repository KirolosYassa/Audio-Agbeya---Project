/* The small solid icons of the web app (24x24 paths), drawn with react-native-svg. */
import React from 'react';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

const ICONS = {
  back: 'M10 5l7 7-7 7-1.4-1.4L14.2 12 8.6 6.4z',
  moon: 'M12 3a9 9 0 1 0 9 9c0-.5 0-.9-.1-1.3A5.5 5.5 0 0 1 13.3 3.1 9 9 0 0 0 12 3z',
  list: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z',
  close: 'M6.4 5L12 10.6 17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4z',
  play: 'M8 5v14l11-7z',
  pause: 'M6 5h4v14H6zM14 5h4v14h-4z',
  prev: 'M6 5h2v14H6zM20 5v14L9 12z',
  next: 'M16 5h2v14h-2zM4 5v14l11-7z',
  replay: 'M12 5V2L7 6l5 4V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z',
  download: 'M12 3v10.2l3.6-3.6L17 11l-5 5-5-5 1.4-1.4 3.6 3.6V3zM5 18h14v2H5z'
} as const;

export type IconName = keyof typeof ICONS;

interface Props { name: IconName; size?: number; color: string; mirror?: boolean; label?: string }

export function Icon({ name, size = 24, color, mirror, label }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={mirror ? { transform: [{ scaleX: -1 }] } : undefined}>
      <Path d={ICONS[name]} fill={color} />
      {label ? <SvgText x="12" y="16.2" fontSize="7" fontWeight="800" textAnchor="middle" fill={color}>{label}</SvgText> : null}
    </Svg>
  );
}
