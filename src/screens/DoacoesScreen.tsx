import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import BottomMenu from '../components/BottomMenu';
import PrimaryButton from '../components/PrimaryButton';
import { useTheme } from '../contexts/ThemeContext';
import type { ScreenProps } from '../routes/types';
import doacaoService, { Doacao } from '../services/doacaoService';
import { createDoacoesStyles } from '../styles/doacoesStyles';

function formatarData(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data indisponível';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nomeDaOng(doacao: Doacao) {
  return doacao.ong?.nome ?? doacao.campanha?.ong?.nome ?? doacao.cnpj ?? 'ONG não informada';
}

export default function DoacoesScreen({ navigation }: ScreenProps<'Doacoes'>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createDoacoesStyles(colors), [colors]);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarDoacoes = useCallback(async () => {
    try {
      setError(null);
      const data = await doacaoService.listarDoacoes();
      setDoacoes(Array.isArray(data) ? data : []);
    } catch (requestError: unknown) {
      const message = (requestError as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? 'Não foi possível carregar suas doações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregarDoacoes(); }, [carregarDoacoes]));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}><Text style={styles.headerTitle}>Minhas Doações</Text></View>
      {loading ? (
        <View style={styles.stateContainer}><ActivityIndicator size="large" color={colors.greenDark} /></View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>{error}</Text>
          <PrimaryButton label="Tentar novamente" onPress={carregarDoacoes} />
        </View>
      ) : (
        <FlatList
          data={doacoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.ongName}>{nomeDaOng(item)}</Text>
                <Text style={styles.dateText}>{formatarData(item.datadoacao)}</Text>
              </View>
              <View style={styles.cardBody}>
                <View style={styles.iconBox}><Icon name="package" size={20} color={colors.greenDark} /></View>
                <View style={styles.donationDetails}>
                  <Text style={styles.quantityText}>{item.quantidade}x {item.tipo}</Text>
                  <Text style={styles.statusText}>{item.status ?? 'Registrada'}</Text>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={[styles.listContent, { paddingBottom: 110, flexGrow: doacoes.length ? 0 : 1 }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); carregarDoacoes(); }} colors={[colors.greenDark]} tintColor={colors.greenDark} />}
          ListEmptyComponent={<View style={styles.stateContainer}><Text style={styles.stateText}>Nenhuma doação encontrada.</Text></View>}
        />
      )}
      <BottomMenu activeRoute="Doacoes" />
    </SafeAreaView>
  );
}
