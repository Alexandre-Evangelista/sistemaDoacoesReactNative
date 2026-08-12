import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createEditarPerfilStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', padding: 20,
    borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  backButton: { marginRight: 16, padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  content: { padding: 24 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 28, backgroundColor: colors.inputBackground },
  editAvatarButton: {
    position: 'absolute', bottom: 0, right: '35%', backgroundColor: colors.greenDark,
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.background,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 8, marginTop: 8 },
});
