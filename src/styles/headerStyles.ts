import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createHeaderStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row',
    justifyContent: 'flex-end', alignItems: 'center', backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 20, paddingBottom: 16, paddingTop: 16, zIndex: 10,
  },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dangerSurface,
    borderWidth: 1, borderColor: colors.danger, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 30,
  },
  logoutIcon: { marginRight: 4 },
  logoutText: { color: colors.danger, fontWeight: '600', fontSize: 13 },
});
