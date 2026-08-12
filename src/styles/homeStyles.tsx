import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createHomeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted, paddingHorizontal: 20 },
  search: {
    backgroundColor: colors.surface, color: colors.textPrimary, borderRadius: 15,
    padding: 15, marginBottom: 25, borderWidth: 1, borderColor: colors.inputBorder,
  },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: colors.textPrimary },
  createButton: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.greenDark,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
  },
  createButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
  card: {
    backgroundColor: colors.surface, borderRadius: 20, padding: 15, marginBottom: 20,
    borderWidth: 1, borderColor: colors.divider, elevation: 3,
  },
  image: {
    width: '100%', height: 180, borderRadius: 15, marginBottom: 12,
    backgroundColor: colors.imagePlaceholder,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textPrimary },
  cardSubtitle: { marginTop: 5, color: colors.textSecondary },
  location: { marginTop: 10, color: colors.textSecondary },
  stateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  stateText: { color: colors.textSecondary, textAlign: 'center', marginBottom: 16 },
});
