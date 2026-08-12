import React, { useMemo } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';
import { createLoginStyles } from '../styles/loginStyles';

type Props = TextInputProps & { icon: string };

export default function InputField({ icon, style, placeholder, accessibilityLabel, ...rest }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createLoginStyles(colors), [colors]);
  return (
    <View style={styles.inputWrapper}>
      <Icon name={icon} size={20} color={colors.placeholder} style={styles.inputIcon} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        style={[styles.input, style]}
        accessibilityLabel={accessibilityLabel ?? placeholder}
        {...rest}
      />
    </View>
  );
}
