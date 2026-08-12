import React, { useMemo } from 'react';
import { ImageBackground, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import type { Campanha } from '../models/Campanha';
import type { RootStackParamList } from '../routes/types';
import { createHomeStyles } from '../styles/homeStyles';
import { resolveMediaUrl } from '../utils/media';

export default function CampaignCard({ campanha }: { campanha: Campanha }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useTheme();
  const styles = useMemo(() => createHomeStyles(colors), [colors]);
  const uri = resolveMediaUrl(campanha.foto);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('CampanhaDetalhes', { campanha })}
      accessibilityRole="button"
      accessibilityLabel={`Abrir campanha ${campanha.nome}`}
    >
      <ImageBackground
        source={uri ? { uri } : undefined}
        style={styles.image}
        imageStyle={{ borderRadius: 15 }}
        accessibilityLabel={`Imagem da campanha ${campanha.nome}`}
      />
      <Text style={styles.cardTitle}>{campanha.nome}</Text>
      <Text style={styles.cardSubtitle}>{campanha.descricao}</Text>
      <Text style={styles.location}>📍 {campanha.ong?.nome ?? 'ONG'}</Text>
    </TouchableOpacity>
  );
}
