import React from 'react';
import { Image, ImageStyle, StyleProp, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from '../contexts/ThemeContext';
import { resolveMediaUrl } from '../utils/media';

type AvatarProps = {
  foto?: string | null;
  tipo?: 'ong' | 'usuario';
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function Avatar({ foto, size = 90, style }: AvatarProps) {
  const { colors } = useTheme();
  const uri = resolveMediaUrl(foto);
  const baseStyle: ImageStyle & ViewStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.28,
    backgroundColor: colors.inputBackground,
  };

  if (uri) return <Image source={{ uri }} style={[baseStyle, style]} accessibilityLabel="Foto de perfil" />;

  return (
    <View style={[baseStyle, { justifyContent: 'center', alignItems: 'center' }, style]} accessibilityLabel="Perfil sem foto">
      <Icon name="user" size={size * 0.55} color={colors.textPrimary} />
    </View>
  );
}
