export type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  inputBackground: string;
  inputBorder: string;
  textPrimary: string;
  textSecondary: string;
  green: string;
  greenDark: string;
  divider: string;
  link: string;
  placeholder: string;
  danger: string;
  dangerSurface: string;
  successSurface: string;
  overlay: string;
  imagePlaceholder: string;
};

export const lightColors: ThemeColors = {
  background: '#FFFFFF', surface: '#FFFFFF', surfaceMuted: '#F5F5F5',
  inputBackground: '#F2F3F5', inputBorder: '#E5E7EB', textPrimary: '#111827',
  textSecondary: '#6B7280', green: '#22C55E', greenDark: '#15803D',
  divider: '#E5E7EB', link: '#16A34A', placeholder: '#9CA3AF', danger: '#DC2626',
  dangerSurface: '#FEF2F2', successSurface: '#F0FDF4', overlay: 'rgba(0,0,0,0.5)',
  imagePlaceholder: '#D1D5DB',
};

export const darkColors: ThemeColors = {
  background: '#0F1410', surface: '#171D18', surfaceMuted: '#111812',
  inputBackground: '#202821', inputBorder: '#344138', textPrimary: '#F3F7F4',
  textSecondary: '#A8B5AB', green: '#4ADE80', greenDark: '#22C55E',
  divider: '#2D3931', link: '#4ADE80', placeholder: '#7F8D83', danger: '#F87171',
  dangerSurface: '#32191B', successSurface: '#17351F', overlay: 'rgba(0,0,0,0.72)',
  imagePlaceholder: '#29332C',
};
