import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createDoacoesStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  header: {
    padding: 20, backgroundColor: colors.surface, borderBottomWidth: 1,
    borderBottomColor: colors.divider, marginBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  listContent: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    backgroundColor: colors.surface, borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: colors.divider, elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  ongName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, flex: 1 },
  dateText: { fontSize: 12, color: colors.textSecondary },
  cardBody: { flexDirection: 'row', alignItems: 'center' },
  iconBox: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: colors.successSurface,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  donationDetails: { flex: 1 },
  quantityText: { fontSize: 15, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  statusText: { fontSize: 13, color: colors.greenDark, fontWeight: '500' },
  stateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  stateText: { color: colors.textSecondary, textAlign: 'center', marginBottom: 16 },
});
