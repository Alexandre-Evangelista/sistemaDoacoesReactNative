import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import { loginStyles } from '../styles/loginStyles';

type Props = {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
};

export default function PrimaryButton({ label, onPress }: Props) {
  return (
    <TouchableOpacity style={loginStyles.primaryButton} onPress={onPress} activeOpacity={0.85}>
      <Text style={loginStyles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}