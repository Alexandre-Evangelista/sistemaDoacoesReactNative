import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createBottomMenuStyles = (colors: ThemeColors, bottomInset: number) => StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row',
    justifyContent: 'space-around', alignItems: 'center', backgroundColor: colors.surface,
    minHeight: 64 + bottomInset, paddingTop: 12, paddingBottom: Math.max(bottomInset, 12),
    borderTopWidth: 1, borderTopColor: colors.divider, elevation: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.12, shadowRadius: 6,
  },
  button: { alignItems: 'center', justifyContent: 'center', gap: 4, flex: 1, minHeight: 48 },
  label: { fontSize: 12, color: colors.placeholder, fontWeight: '500' },
  labelActive: { color: colors.greenDark, fontWeight: '700' },
});
