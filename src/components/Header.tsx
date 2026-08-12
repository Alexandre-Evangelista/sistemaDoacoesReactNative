import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../contexts/ThemeContext';
import { createHeaderStyles } from '../styles/headerStyles';

export default function Header({ onLogout }: { onLogout: () => void | Promise<void> }) {
  const { colors } = useTheme();
  const styles = useMemo(() => createHeaderStyles(colors), [colors]);
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onLogout}
        style={styles.logoutButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Sair do aplicativo"
      >
        <Icon name="logout" size={14} color={colors.danger} style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
