import React from 'react';
import { TextInput, View, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { loginStyles, colors } from '../styles/loginStyles';

type Props = TextInputProps & {
  icon: 'mail' | 'lock';
};

export default function InputField({ icon, ...rest }: Props) {
  return (
    <View style={loginStyles.inputWrapper}>
      <Icon name={icon} size={20} color={colors.placeholder} style={loginStyles.inputIcon} />
      <TextInput
        placeholderTextColor={colors.placeholder}
        style={loginStyles.input}
        {...rest}
      />
    </View>
  );
}