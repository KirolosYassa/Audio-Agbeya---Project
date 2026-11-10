import { useWindowDimensions } from 'react-native';
import { SCREEN_GUTTER } from '../config/layout';

const COLUMNS = 3;
const LIBRARY_BOX_EXTRA = 24 + 2 + 2; // library box padding + border, plus 2px safety so three tiles always fit

/** Width of one hour tile so that exactly three fit in a row. */
export function useLibraryTileSize(): number {
  const { width } = useWindowDimensions();
  return Math.floor((width - SCREEN_GUTTER * 2 - LIBRARY_BOX_EXTRA) / COLUMNS);
}
