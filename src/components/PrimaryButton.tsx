import React, { useMemo } from 'react';
import { ActivityIndicator, GestureResponderEvent, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { createLoginStyles } from '../styles/loginStyles';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
};

export default function PrimaryButton({ label, onPress, disabled = false, loading = false }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createLoginStyles(colors), [colors]);
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </TouchableOpacity>
  );
}
