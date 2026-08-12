import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createConfiguracoesStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  backButton: { marginRight: 16, padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase',
    marginLeft: 20, marginTop: 24, marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.inputBorder,
  },
  optionTextContainer: { flexDirection: 'row', alignItems: 'center' },
  optionText: { fontSize: 16, color: colors.textPrimary, marginLeft: 12 },
});
