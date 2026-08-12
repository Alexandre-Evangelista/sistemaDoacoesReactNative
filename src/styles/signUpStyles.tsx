import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createSignUpStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surfaceMuted },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: colors.surface, borderRadius: 25, padding: 22,
    borderWidth: 1, borderColor: colors.divider, elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: colors.divider },
  separatorText: { marginHorizontal: 12, color: colors.placeholder },
  googleButton: {
    height: 50, borderWidth: 1, borderColor: colors.inputBorder,
    borderRadius: 14, justifyContent: 'center', alignItems: 'center',
  },
  googleText: { fontSize: 15, color: colors.textPrimary },
  footerText: { textAlign: 'center', marginTop: 22, color: colors.placeholder },
  loginText: { color: colors.link, fontWeight: '600' },
});
