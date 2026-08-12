import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/AntDesign';
import BottomMenu from '../components/BottomMenu';
import CampaignCard from '../components/CampaignCard';
import Header from '../components/Header';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import type { Campanha } from '../models/Campanha';
import type { ScreenProps } from '../routes/types';
import api from '../services/api';
import { createHomeStyles } from '../styles/homeStyles';

export default function HomeScreen({ navigation }: ScreenProps<'Home'>) {
  const { role, logout } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createHomeStyles(colors), [colors]);
  const [campanhas, setCampanhas] = useState<Campanha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');

  const carregarCampanhas = useCallback(async () => {
    setError(null);
    try {
      const response = await api.get<Campanha[]>('/campanha');
      setCampanhas(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError('Não foi possível carregar as campanhas. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarCampanhas(); }, [carregarCampanhas]));

  const termo = busca.trim().toLocaleLowerCase('pt-BR');
  const campanhasFiltradas = campanhas.filter((campanha) =>
    campanha.nome?.toLocaleLowerCase('pt-BR').includes(termo)
    || campanha.descricao?.toLocaleLowerCase('pt-BR').includes(termo));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Header onLogout={logout} />
      <View style={{ paddingTop: 64 }}>
        <View style={{ marginBottom: 20, marginTop: 10 }}>
          <Image source={require('../../assets/logo.png')} style={{ width: 120, height: 40, resizeMode: 'contain' }} />
        </View>
        <TextInput
          style={styles.search}
          placeholder="Buscar ONGs ou campanhas..."
          placeholderTextColor={colors.placeholder}
          value={busca}
          onChangeText={setBusca}
          accessibilityLabel="Buscar campanhas"
        />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Campanhas em destaque</Text>
          {role === 'ong' && (
            <TouchableOpacity onPress={() => navigation.navigate('CriarCampanha')} style={styles.createButton} activeOpacity={0.8} accessibilityRole="button">
              <Icon name="plus" size={14} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Criar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.stateContainer}><ActivityIndicator size="large" color={colors.greenDark} /></View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{error}</Text>
          <PrimaryButton label="Tentar novamente" onPress={carregarCampanhas} />
        </View>
      ) : (
        <FlatList
          data={campanhasFiltradas}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CampaignCard campanha={item} />}
          contentContainerStyle={{ paddingBottom: 110, flexGrow: campanhasFiltradas.length ? 0 : 1 }}
          ListEmptyComponent={<View style={styles.stateContainer}><Text style={styles.stateText}>Nenhuma campanha encontrada.</Text></View>}
        />
      )}
      <BottomMenu activeRoute="Home" />
    </SafeAreaView>
  );
}
