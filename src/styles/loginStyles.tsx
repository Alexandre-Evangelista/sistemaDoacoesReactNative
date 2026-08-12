import { StyleSheet } from 'react-native';
import type { ThemeColors } from './theme';

export const createLoginStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 24, paddingTop: 64 },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginTop: 8, marginBottom: 32 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.inputBackground,
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 14,
    paddingHorizontal: 16, minHeight: 56, marginBottom: 16,
  },
  input: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 14 },
  inputIcon: { marginRight: 10 },
  primaryButton: {
    backgroundColor: colors.greenDark, borderRadius: 28, height: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: colors.greenDark, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  primaryButtonDisabled: { opacity: 0.55 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { marginHorizontal: 12, color: colors.textSecondary, fontSize: 13 },
  googleButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 28, height: 56,
  },
  googleIcon: { marginRight: 10 },
  googleText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerText: { color: colors.textSecondary, fontSize: 14 },
  footerLink: { color: colors.link, fontSize: 14, fontWeight: '600' },
});
