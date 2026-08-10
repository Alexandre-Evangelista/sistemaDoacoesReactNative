import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { doacoesStyles as styles } from '../styles/doacoesStyles';
import { colors } from '../styles/loginStyles';
import BottomMenu from '../components/BottomMenu';
import doacaoService, { Doacao } from '../services/doacaoService';

function formatarData(dataISO: string) {
  try {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dataISO;
  }
}

export default function DoacoesScreen({ navigation }: any) {
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregarDoacoes = useCallback(async () => {
    try {
      setErro(null);
      const data = await doacaoService.listarDoacoes();
      setDoacoes(data);
    } catch (error: any) {
      setErro(error?.response?.data?.message ?? 'Não foi possível carregar suas doações.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, []);

  useEffect(() => {
    carregarDoacoes();
  }, [carregarDoacoes]);

  function handleRefresh() {
    setAtualizando(true);
    carregarDoacoes();
  }

  function renderItem({ item }: { item: Doacao }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          
          <Text style={styles.ongName}>{item.tipo ?? 'Doação'}</Text>
          <Text style={styles.dateText}>{formatarData(item.datadoacao)}</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.iconBox}>
            <Icon name="package" size={20} color={colors.greenDark} />
          </View>
          <View style={styles.donationDetails}>
            <Text style={styles.quantityText}>{item.quantidade}x {item.tipo}</Text>
            <Text style={styles.statusText}>Concluída</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Doações</Text>
      </View>

      {carregando ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.greenDark} />
        </View>
      ) : erro ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center' }}>{erro}</Text>
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={atualizando} onRefresh={handleRefresh} colors={[colors.greenDark]} />
          }
          ListEmptyComponent={
            <View style={{ paddingTop: 40, alignItems: 'center' }}>
              <Text style={{ color: colors.textSecondary }}>Nenhuma doação encontrada.</Text>
            </View>
          }
        />
      )}

      <BottomMenu navigation={navigation} activeRoute="Doacoes" />
    </SafeAreaView>
  );
}