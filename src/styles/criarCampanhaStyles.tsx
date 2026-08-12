import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createCriarCampanhaStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backButton: { marginRight: 12, padding: 8, marginLeft: -8 },
  title: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  fotoPicker: {
    height: 180, borderRadius: 16, backgroundColor: colors.inputBackground,
    borderWidth: 1, borderColor: colors.inputBorder, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20, overflow: 'hidden',
  },
  fotoPreview: { width: '100%', height: '100%' },
  fotoPlaceholderText: { marginTop: 8, color: colors.placeholder, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8, marginTop: 4 },
});
