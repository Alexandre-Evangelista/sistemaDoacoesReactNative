import React from 'react';
import { View, Image, StyleProp, ViewStyle, ImageStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { API_URL } from '../config/variaveis';

type AvatarProps = {
  foto?: string | null;
  tipo?: 'ong' | 'usuario';
  size?: number;
  style?: StyleProp<ViewStyle | ImageStyle>;
};

function resolverUri(foto: string, tipo: 'ong' | 'usuario') {
  if (foto.startsWith('file://') || foto.startsWith('http://') || foto.startsWith('https://')) {
    return foto;
  }

  // Backend hoje salva foto de usuário e de ONG na mesma pasta "ong"
  const url = `${API_URL}/uploads/ong/${encodeURIComponent(foto)}`;
  console.log('AVATAR URI:', url);
  return url;
}

export default function Avatar({ foto, tipo = 'usuario', size = 90, style }: AvatarProps) {
  if (foto) {
    return (
      <Image
        source={{ uri: resolverUri(foto, tipo) }}
        style={[
          { width: size, height: size, borderRadius: size * 0.28 },
          style as StyleProp<ImageStyle>,
        ]}
        onError={(e) => console.log('AVATAR ERRO:', tipo, e.nativeEvent.error)}
        onLoad={() => console.log('AVATAR CARREGOU OK:', tipo)}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.28,
          backgroundColor: '#EAEAEE',
          justifyContent: 'center',
          alignItems: 'center',
        },
        style as StyleProp<ViewStyle>,
      ]}
    >
      <Icon name="user" size={size * 0.55} color="#1A1A1A" />
    </View>
  );
}